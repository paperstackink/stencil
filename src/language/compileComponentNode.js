import { unified } from 'unified'
import parse from 'rehype-parse-ns'
import { select } from 'hast-util-select'

import CompilationError from '@/errors/CompilationError'

import templates from '@/language/templates'
import compileAttributes from '@/language/compileAttributes'
import normaliseTree from '@/language/normaliseTree'

import afterLast from '@/helpers/afterLast'
import isDocument from '@/helpers/isDocument'
import findDuplicates from '@/helpers/findDuplicates'
import extractUsedIdentifiersFromNode from '@/helpers/extractUsedIdentifiersFromNode'

export default function (node, context) {
    if (!(node.tagName in context.components)) {
        throw new CompilationError(
            `Componenent '${node.tagName}' is not defined.`,
        )
    }

    const definition = context.components[node.tagName]

    const componentTree = unified()
        .use(parse, { fragment: !isDocument(definition.trim()) })
        .parse(definition.trim())

    const normalisedTree = normaliseTree(componentTree)

    if (normalisedTree.children.length > 1) {
        throw new CompilationError(
            `Component '${node.tagName}' has more than 1 root element.`,
        )
    }

    const [attributes, usedIdentifiers] = compileAttributes(
        node.properties,
        context,
    )

    // When we run 'parse' above it only executes the 'parse' phase of the lifecycle
    // We have to explicitly call 'runSync' to get it to run plugins on the tree
    const transformedComponentTree = unified()
        .use(templates, {
            environment: { ...context.environment, ...attributes },
            components: context.components,
            slots: { default: node.children },
        })
        .runSync(normalisedTree)

    const usedAttributes = extractUsedIdentifiersFromNode(
        transformedComponentTree,
    )

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
            usedIdentifiers,
        },
        properties: { ...component.properties, ...rootAttributes },
    }

    return [newComponent]
}
