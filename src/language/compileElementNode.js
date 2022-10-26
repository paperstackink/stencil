import compileNode from '@/language/compileNode'
import compileAttributes from '@/language/compileAttributes'

export default function (node, context) {
    const newNode = { ...node }
    const [properties, usedValues] = compileAttributes(node.properties, context)

    newNode.meta = {
        usedValues,
    }

    newNode.properties = properties

    newNode.children = newNode.children.flatMap(childNode =>
        compileNode(childNode, context),
    )

    return [newNode]
}
