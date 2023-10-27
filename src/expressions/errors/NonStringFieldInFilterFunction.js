export default class NonStringFieldInFilterFunction extends Error {
    constructor(method, type) {
        super()

        this.name = 'NonStringFieldInFilterFunction'
        this.position = null
        this.expression = null
        this.method = method
        this.type = type
    }
}
