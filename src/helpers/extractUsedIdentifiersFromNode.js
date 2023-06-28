const extractUsedIdentifiersFromNode = node => {
    let usedIdentifiers = []

    if (node.meta && node.meta.usedIdentifiers) {
        usedIdentifiers = [...usedIdentifiers, ...node.meta.usedIdentifiers]
    }

    if (node.children) {
        node.children.forEach(childNode => {
            const usedChildIdentifiers =
                extractUsedIdentifiersFromNode(childNode)
            usedIdentifiers = [...usedIdentifiers, ...usedChildIdentifiers]
        })
    }

    return usedIdentifiers
}

export default extractUsedIdentifiersFromNode
