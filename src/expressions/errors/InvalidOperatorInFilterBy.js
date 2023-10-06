export default class InvalidOperatorInFilterBy extends Error {
    constructor(operator, operators) {
        super()

        this.name = 'InvalidOperatorInFilterBy'
        this.position = null
        this.expression = null
        this.operator = operator
        this.operators = operators
    }
}
