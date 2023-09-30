export default class UnclosedGroupExpression extends Error {
    constructor() {
        super()

        this.name = 'UnclosedGroupExpression'
        this.position = null
        this.expression = null
    }
}
