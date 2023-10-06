export default class UnclosedExpression extends Error {
    constructor(position) {
        super()

        this.name = 'UnclosedExpression'
        this.position = position
    }
}
