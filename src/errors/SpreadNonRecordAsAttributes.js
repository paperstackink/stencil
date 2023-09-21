export default class SpreadNonRecordAsAttributes extends Error {
    constructor(position, expression, value) {
        super()

        this.name = 'SpreadNonRecordAsAttributes'
        this.position = position
        this.expression = expression
        this.value = value
    }
}
