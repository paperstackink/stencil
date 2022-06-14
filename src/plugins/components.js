import { unified, SKIP } from 'unified'
import parse from 'rehype-parse-ns'
import { visit } from 'unist-util-visit'
import { select } from 'hast-util-select'

import isUppercase from '@/helpers/isUppercase'
import CompilationError from '@/errors/CompilationError'

const defaultOptions = {
    components: {},
}

const components = (options = defaultOptions) => {
    const { components } = options

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

            // Get the actual root node
            const component = select(':first-child', componentTree)

            parent.children.splice(1, 1, component)

            return [SKIP, index]
        })
    }
}

export default components
