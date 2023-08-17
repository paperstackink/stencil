export default class ComponentNameNotProvidedError extends Error {
    constructor(message) {
        super(message)

        this.name = 'ComponentNameNotProvidedError'
    }
}
