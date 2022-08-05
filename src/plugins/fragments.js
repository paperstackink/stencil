import { visit, SKIP } from 'unist-util-visit'

const fragments = () => {
    return (tree, vfile) => {
        visit(tree, (node, index, parent) => {
            if (node.tagName !== 'Fragment') {
                return
            }

            parent.children.splice(1, node.children.length, ...node.children)

            return [SKIP, index]
        })
    }
}

export default fragments
