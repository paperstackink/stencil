export default class InvalidNumberOperatorInFilterBy extends Error {
    constructor(operator, type, field) {
        super()

        this.name = 'InvalidNumberOperatorInFilterBy'
        this.position = null
        this.expression = null
        this.operator = operator
        this.type = type
        this.field = field
    }
}
