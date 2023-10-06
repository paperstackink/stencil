export default class ArityMismatch extends Error {
    constructor(method, expected, actual) {
        super()

        this.name = 'ArityMismatch'
        this.position = null
        this.expression = null
        this.method = method
        this.expected = expected
        this.actual = actual
    }
}
