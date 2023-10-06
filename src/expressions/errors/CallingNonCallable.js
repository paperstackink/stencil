export default class CallingNonCallable extends Error {
    constructor(type) {
        super()

        this.name = 'CallingNonCallable'
        this.position = null
        this.expression = null
        this.type = type
    }
}
