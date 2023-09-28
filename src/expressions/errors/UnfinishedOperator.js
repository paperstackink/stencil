export default class UnknownOperator extends Error {
    constructor(operator, suggestion) {
        super()

        this.name = 'UnknownOperator'
        this.position = null
        this.expression = null
        this.operator = operator
        this.suggestion = suggestion
    }
}
