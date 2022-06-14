import { unified, SKIP } from 'unified'
import parse from 'rehype-parse-ns'
import { visit } from 'unist-util-visit'
import { select } from 'hast-util-select'

import CompilationError from '@/errors/CompilationError'

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
    let { components } = options

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
                return node
            }

            if (!isUppercase(node.tagName.charAt(0))) {
                return node
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
                .parse(definition.trim()) // Trim so that no `text` nodes with whitespace are created

            if (componentTree.children.length > 1) {
                throw new CompilationError(
                    `Component '${node.tagName}' has more than 1 root element.`,
                )
            }

            // Get the actual root node
            const component = select(':first-child', componentTree)

            parent.children.splice(1, 1, component)

            return [SKIP, index]
        })
    }
}

export default components
