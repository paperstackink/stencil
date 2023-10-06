export default class InvalidNumberOperatorInFilterFunction extends Error {
    constructor(method, operator, type, field) {
        super()

        this.name = 'InvalidNumberOperatorInFilterFunction'
        this.position = null
        this.expression = null
        this.method = method
        this.operator = operator
        this.type = type
        this.field = field
    }
}
