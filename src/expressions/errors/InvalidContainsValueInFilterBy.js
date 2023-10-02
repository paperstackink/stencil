export default class InvalidContainsOperatorInFilterBy extends Error {
    constructor(type) {
        super()

        this.name = 'InvalidContainsOperatorInFilterBy'
        this.position = null
        this.expression = null
        this.type = type
    }
}
