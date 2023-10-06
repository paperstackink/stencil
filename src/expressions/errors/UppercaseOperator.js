export default class UppercaseOperator extends Error {
    constructor(operator) {
        super()

        this.name = 'UppercaseOperator'
        this.position = null
        this.expression = null
        this.operator = operator
    }
}
