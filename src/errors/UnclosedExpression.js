export default class UnclosedExpression extends Error {
    constructor() {
        super()

        this.name = 'UnclosedExpression'
    }
}
