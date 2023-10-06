export default class NonNumberOperand extends Error {
    constructor(operator, value, type) {
        super()

        this.name = 'NonNumberOperand'
        this.position = null
        this.expression = null
        this.operator = operator
        this.value = value
        this.type = type
    }
}
