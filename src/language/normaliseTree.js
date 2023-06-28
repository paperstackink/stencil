import normaliseExpressionsInAttributes from '@/helpers/normaliseExpressionsInAttributes'

const normaliseTree = node => {
    let newNode = { ...node }

    if (node.properties) {
        node.properties = normaliseExpressionsInAttributes(node.properties)
    }

    if (node.children) {
        newNode.children = node.children.map(node => normaliseTree(node))
    }

    return newNode
}

export default normaliseTree
