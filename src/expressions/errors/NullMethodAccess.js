export default class NullMethodAccess extends Error {
    constructor(method) {
        super()

        this.name = 'NullMethodAccess'
        this.position = null
        this.expression = null
        this.method = method
    }
}
