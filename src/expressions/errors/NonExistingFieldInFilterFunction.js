export default class NonExistingFieldInFilterFunction extends Error {
    constructor(method, field, value) {
        super()

        this.name = 'NonExistingFieldInFilterFunction'
        this.position = null
        this.expression = null
        this.method = method
        this.field = field
        this.value = value
    }
}
