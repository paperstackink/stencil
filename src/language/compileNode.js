import match from '@/helpers/match'
import isUppercase from '@/helpers/isUppercase'

import compileSlot from '@/language/compileSlot'
import compileTextNode from '@/language/compileTextNode'
import compileFragment from '@/language/compileFragment'
import compileElementNode from '@/language/compileElementNode'
import compileComponentNode from '@/language/compileComponentNode'

// Signature: node => [node]
// Because text nodes might be split into multiple nodes
export default function (node, context) {
    const compiler = match(node.type, {
        text: compileTextNode,
        element: (node, context) => {
            if (node.tagName === 'slot') {
                return compileSlot(node, context)
            }

            if (node.tagName === 'Fragment') {
                return compileFragment(node, context)
            }

            if (isUppercase(node.tagName.charAt(0))) {
                return compileComponentNode(node, context)
            }

            return compileElementNode(node, context)
        },
        default: node => node,
    })

    return compiler(node, context)
}
