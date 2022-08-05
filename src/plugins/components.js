import { unified } from 'unified'
import parse from 'rehype-parse-ns'
import { visit, SKIP } from 'unist-util-visit'
import { select } from 'hast-util-select'

import CompilationError from '@/errors/CompilationError'

import slots from '@/plugins/slots'
import output from '@/plugins/output'

import conform from '@/helpers/conformer'
import afterLast from '@/helpers/afterLast'
import isUppercase from '@/helpers/isUppercase'
import findDuplicates from '@/helpers/findDuplicates'

const stripPathNameFromComponentNames = (components) => {
    return Object.fromEntries(
        Object.entries(components).map((entry) => {
            return [afterLast(entry[0], '/'), entry[1]]
        }),
    )
}

const findDuplicateComponentNames = (components) => {
    const names = Object.entries(components).map((entry) => {
        return afterLast(entry[0], '/')
    })

    return findDuplicates(names)
}

const defaultOptions = {
    components: {},
}

const components = (options = defaultOptions) => {
    let { components, environment } = options

    const duplicateNames = findDuplicateComponentNames(components)

    if (duplicateNames.length > 0) {
        throw new CompilationError(
            `Component '${duplicateNames[0]}' was defined multiple times.`,
        )
    }

    components = stripPathNameFromComponentNames(components)

    return (tree, vfile) => {
        visit(tree, 'element', (node, index, parent) => {
            if (node.type !== 'element') {
                return
            }

            if (!isUppercase(node.tagName.charAt(0))) {
                return
            }

            if (node.tagName === 'Fragment') {
                return
            }

            if (!(node.tagName in components)) {
                throw new CompilationError(
                    `Componenent '${node.tagName}' is not defined.`,
                )
            }

            const definition = components[node.tagName]

            // When parsing the component definition it wraps it's in a `root` element.
            const componentTree = unified()
                .use(parse, { fragment: true })
                .parse(conform(definition.trim())) // Trim so that no `text` nodes with whitespace are created

            if (componentTree.children.length > 1) {
                throw new CompilationError(
                    `Component '${node.tagName}' has more than 1 root element.`,
                )
            }

            const attributes = node.properties

            // When we run 'parse' above it only executes the 'parse' phase of the lifecycle
            // We have to explicitly call 'runSync' to get it to run plugins on the tree
            const transformedComponentTree = unified()
                .use(output, {
                    values: { ...environment, ...attributes },
                })
                .use(slots, {
                    slots: {
                        default: node.children,
                    },
                })
                .runSync(componentTree)

            // Get the actual root node
            const component = select(':first-child', transformedComponentTree)

            // Filter out attributes that have been outputted
            const usedValues =
                transformedComponentTree.meta &&
                transformedComponentTree.meta.usedValues
                    ? transformedComponentTree.meta.usedValues
                    : []

            const filteredAttributes = Object.fromEntries(
                Object.entries(attributes).filter(([key]) => {
                    return !usedValues.includes(key)
                }),
            )

            const newComponent = {
                ...component,
                properties: { ...component.properties, ...filteredAttributes },
            }

            parent.children.splice(1, 1, newComponent)

            return [SKIP, index]
        })
    }
}

export default components
