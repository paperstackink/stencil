import compileNode from '@/language/compileNode'

const compileRootNode = (node, context) => {
    const children = node.children.flatMap(childNode =>
        compileNode(childNode, context),
    )

    return { ...node, children }
}

const defaultContext = {
    environment: {
        global: {},
        local: {},
    },
    components: {},
    slots: {},
}

const plugin = (context = defaultContext) => {
    return root => compileRootNode(root, context)
}

export default plugin
