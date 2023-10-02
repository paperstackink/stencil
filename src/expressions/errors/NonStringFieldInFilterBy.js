export default class NonStringFieldInFilterBy extends Error {
    constructor(type) {
        super()

        this.name = 'NonStringFieldInFilterBy'
        this.position = null
        this.expression = null
        this.type = type
    }
}
