export default class ReservedComponentNameError extends Error {
    constructor(message) {
        super(message)

        this.name = 'ReservedComponentNameError'
    }
}
