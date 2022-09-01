import flatMap from 'unist-util-flatmap'

import match from '@/helpers/match'

import compileTextNode from '@/language/compileTextNode'
import compileElementOrComponentNode from '@/language/compileElementOrComponentNode'

const defaultOptions = {
    values: {},
}

export default function (options = defaultOptions) {
    const { values } = options

    return (tree, vfile) => {
        flatMap(tree, (node, index, parent) => {
            const compiler = match(node.type, {
                text: compileTextNode,
                element: compileElementOrComponentNode,
                default: (node) => [node],
            })

            return compiler(node, values)
        })
    }
}
