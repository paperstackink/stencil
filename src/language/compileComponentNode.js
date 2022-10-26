import { unified } from 'unified'
import parse from 'rehype-parse-ns'
import { select } from 'hast-util-select'

import CompilationError from '@/errors/CompilationError'

import templates from '@/language/templates'
import compileAttributes from '@/language/compileAttributes'

import conform from '@/helpers/conformer'
import afterLast from '@/helpers/afterLast'
import isDocument from '@/helpers/isDocument'
import findDuplicates from '@/helpers/findDuplicates'
import extractUsedValuesFromNode from '@/helpers/extractUsedValuesFromNode'

const stripPathNameFromComponentNames = components => {
    return Object.fromEntries(
        Object.entries(components).map(entry => {
            return [afterLast(entry[0], '/'), entry[1]]
        }),
    )
}

const findDuplicateComponentNames = components => {
    const names = Object.entries(components).map(entry => {
        return afterLast(entry[0], '/')
    })

    return findDuplicates(names)
}

export default function (node, context) {
    const duplicateNames = findDuplicateComponentNames(context.components)

    if (duplicateNames.length > 0) {
        throw new CompilationError(
            `Component '${duplicateNames[0]}' was defined multiple times.`,
        )
    }

    const components = stripPathNameFromComponentNames(context.components)

    if (!(node.tagName in components)) {
        throw new CompilationError(
            `Componenent '${node.tagName}' is not defined.`,
        )
    }

    const definition = components[node.tagName]

    const conformedDefinition = conform(definition.trim()) // Trim so that no `text` nodes with whitespace are created

    const componentTree = unified()
        .use(parse, { fragment: !isDocument(conformedDefinition) })
        .parse(conformedDefinition)

    if (componentTree.children.length > 1) {
        throw new CompilationError(
            `Component '${node.tagName}' has more than 1 root element.`,
        )
    }

    const [attributes, usedValues] = compileAttributes(node.properties, context)

    // When we run 'parse' above it only executes the 'parse' phase of the lifecycle
    // We have to explicitly call 'runSync' to get it to run plugins on the tree
    const transformedComponentTree = unified()
        .use(templates, {
            environment: { ...context.environment, ...attributes },
            components: context.components,
            slots: { default: node.children },
        })
        .runSync(componentTree)

    const usedAttributes = extractUsedValuesFromNode(transformedComponentTree)

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
            usedValues,
        },
        properties: { ...component.properties, ...rootAttributes },
    }

    return [newComponent]
}
