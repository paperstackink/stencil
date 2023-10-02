export default class OperatorTypeMismatch extends Error {
    constructor(leftType, rightType) {
        super()

        this.name = 'OperatorTypeMismatch'
        this.position = null
        this.expression = null
        this.leftType = leftType
        this.rightType = rightType
    }
}
