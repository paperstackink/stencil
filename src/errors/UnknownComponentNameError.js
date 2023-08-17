export default class UnknownComponentNameError extends Error {
    constructor(message) {
        super(message)

        this.name = 'UnknownComponentNameError'
    }
}
