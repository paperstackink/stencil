export default class MissingExpression extends Error {
    constructor() {
        super()

        this.name = 'MissingExpression'
        this.position = null
        this.expression = null
    }
}
