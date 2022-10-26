const extractUsedValuesFromNode = node => {
    let usedValues = []

    if (node.meta && node.meta.usedValues) {
        usedValues = [...usedValues, ...node.meta.usedValues]
    }

    if (node.children) {
        node.children.forEach(childNode => {
            const usedChildValues = extractUsedValuesFromNode(childNode)
            usedValues = [...usedValues, ...usedChildValues]
        })
    }

    return usedValues
}

export default extractUsedValuesFromNode
