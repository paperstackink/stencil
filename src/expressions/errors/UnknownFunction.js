export default class UnknownFunction extends Error {
    constructor(method) {
        super()

        this.name = 'UnknownFunction'
        this.position = null
        this.expression = null
        this.method = method
    }
}
