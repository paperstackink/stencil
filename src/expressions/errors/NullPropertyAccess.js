export default class NullPropertyAccess extends Error {
    constructor(method) {
        super()

        this.name = 'NullPropertyAccess'
        this.position = null
        this.expression = null
        this.method = method
    }
}
