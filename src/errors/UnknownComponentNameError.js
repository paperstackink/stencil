export default class UnknownComponentNameError extends Error {
    constructor(name) {
        super()

        this.name = 'UnknownComponentNameError'
        this.component = name
    }
}
