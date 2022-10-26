import compileNode from '@/language/compileNode'
import isWhitespace from '@/helpers/isWhitespace'

export default function (node, context) {
    const noSlotProvided =
        context.slots.default.length === 0 ||
        context.slots.default.every(
            node => node.type === 'text' && isWhitespace(node.value),
        )

    if (noSlotProvided) {
        if (node.children.length) {
            const children = node.children.flatMap(childNode =>
                compileNode(childNode, context),
            )
            return children
        } else {
            return [
                {
                    type: 'text',
                    value: '',
                },
            ]
        }
    }

    return context.slots.default.flatMap(node => compileNode(node, context))
}
