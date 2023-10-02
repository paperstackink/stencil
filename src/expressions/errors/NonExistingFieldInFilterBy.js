export default class NonExistingFieldInFilterBy extends Error {
    constructor(field, value) {
        super()

        this.name = 'NonExistingFieldInFilterBy'
        this.position = null
        this.expression = null
        this.field = field
        this.value = value
    }
}
