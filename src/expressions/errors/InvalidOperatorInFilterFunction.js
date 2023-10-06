export default class InvalidOperatorInFilterFunction extends Error {
    constructor(method, operator, operators) {
        super()

        this.name = 'InvalidOperatorInFilterFunction'
        this.position = null
        this.expression = null
        this.method = method
        this.operator = operator
        this.operators = operators
    }
}
