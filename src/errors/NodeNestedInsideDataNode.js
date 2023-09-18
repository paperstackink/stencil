export default class NodeNestedInsideDataNode extends Error {
    constructor(position) {
        super()

        this.name = 'NodeNestedInsideDataNode'
        this.position = position
    }
}
