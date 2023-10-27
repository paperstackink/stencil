export default class InvalidContainsValueInFilterFunction extends Error {
    constructor(method, type) {
        super()

        this.name = 'InvalidContainsValueInFilterFunction'
        this.position = null
        this.expression = null
        this.method = method
        this.type = type
    }
}
