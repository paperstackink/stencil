export default class NestedExpression extends Error {
    constructor(position) {
        super()

        this.name = 'NestedExpression'
        this.position = position
    }
}
