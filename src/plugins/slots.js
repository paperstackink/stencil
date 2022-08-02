import { SKIP } from 'unified'
import { visit } from 'unist-util-visit'

const defaultOptions = {
    slots: {},
}

const slots = (options = defaultOptions) => {
    const { slots } = options

    return (tree, vfile) => {
        visit(tree, (node, index, parent) => {
            if (node.tagName !== 'slot') {
                return
            }

            if (slots.default.length === 0) {
                // Show the <slot />'s default content if provided
                if (node.children.length > 1) {
                    const newNode = {
                        tagName: 'Fragment',
                        children: node.children,
                    }

                    parent.children.splice(1, 1, newNode)
                } else {
                    const emptyTextNode = {
                        type: 'text',
                        value: '',
                    }

                    parent.children.splice(1, 1, emptyTextNode)
                }

                return [SKIP, index]
            }

            const newNode = {
                ...node,
                tagName: 'Fragment',
                children: slots.default,
            }

            parent.children.splice(1, 1, newNode)

            return [SKIP, index]
        })
    }
}

export default slots
