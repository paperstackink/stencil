import { unified } from 'unified'
import parse from 'rehype-parse-ns'
import { select } from 'hast-util-select'

import UnknownComponentName from '@/errors/UnknownComponentName'
import ComponentNameNotProvided from '@/errors/ComponentNameNotProvided'
import MultipleRootsInComponent from '@/errors/MultipleRootsInComponent'
import UnknownDynamicComponentName from '@/errors/UnknownDynamicComponentName'

import templates from '@/language/templates'
import compileSlots from '@/language/compileSlots'
import normaliseTree from '@/language/normaliseTree'
import compileAttributes from '@/language/compileAttributes'

import conform from '@/helpers/conform'
import isDocument from '@/helpers/isDocument'
import extractUsedIdentifiersFromNode from '@/helpers/extractUsedIdentifiersFromNode'
import compileExpressions from '@/language/compileExpressions'

export default function (node, context) {
    const isDynamicComponent = node.tagName === 'Component'
    if (!(node.tagName in context.components) && !isDynamicComponent) {
        throw new UnknownComponentName(node.tagName, node.position)
    }

    const [attributes, usedIdentifiers] = compileAttributes(
        node.properties,
        context,
        node.position,
    )

    if (isDynamicComponent && !attributes.hasOwnProperty('is')) {
        throw new ComponentNameNotProvided(node.position)
    }

    let name = node.tagName
    let componentNameUsedIdentifiers = []

    if (isDynamicComponent) {
        const [resolvedName, usedIdentifiers] = compileExpressions(
            attributes.is,
            {
                ...context.environment.global,
                ...context.environment.local,
            },
            false,
        )

        name = resolvedName
        componentNameUsedIdentifiers = usedIdentifiers
    }

    if (isDynamicComponent && !(name in context.components)) {
        throw new UnknownDynamicComponentName(name, node.position)
    }

    let definition = context.components[name]

    if (isDynamicComponent) {
        delete attributes.is
    }

    const componentTree = unified()
        .use(parse, { fragment: !isDocument(definition.trim()) })
        .parse(conform(definition.trim()))

    const normalisedTree = normaliseTree(componentTree)

    if (normalisedTree.children.length > 1) {
        throw new MultipleRootsInComponent(definition)
    }

    // In order to support component 'extending' other components,
    // we need to pre-compile the slots before compiling any nested components.
    const treeWithCompiledSlots = compileSlots(componentTree, {
        environment: {
            ...context.environment,
            local: {
                ...context.environment.local,
                ...attributes,
                $attributes: Map.fromObject(attributes),
            },
        },
        components: context.components,
        slots: { default: node.children },
    })

    // When we run 'parse' above it only executes the 'parse' phase of the lifecycle
    // We have to explicitly call 'runSync' to get it to run plugins on the tree
    const transformedComponentTree = unified()
        .use(templates, {
            environment: {
                ...context.environment,
                local: {
                    ...attributes,
                    $attributes: Map.fromObject(attributes),
                },
            },
            components: context.components,
            slots: { default: node.children },
        })
        .runSync(treeWithCompiledSlots)

    const usedAttributes = [
        ...extractUsedIdentifiersFromNode(treeWithCompiledSlots), // For some reason some 'meta' data gets lost when compiling this tree so for now we just extract from this tree as well
        ...extractUsedIdentifiersFromNode(transformedComponentTree),
    ]

    // Get the actual root node
    const component = select(':first-child', transformedComponentTree)

    // Filter out attributes used in the template from being applied to the root element
    const rootAttributes = Object.fromEntries(
        Object.entries(attributes).filter(
            ([name]) => !usedAttributes.includes(name),
        ),
    )

    const newComponent = {
        ...component,
        meta: {
            usedIdentifiers: [
                ...componentNameUsedIdentifiers,
                ...usedIdentifiers,
            ],
        },
        properties: { ...component.properties, ...rootAttributes },
    }

    return [newComponent]
}
