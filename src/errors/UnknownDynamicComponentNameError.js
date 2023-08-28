export default class UnknownDynamicComponentNameError extends Error {
    constructor(name) {
        super()

        this.name = 'UnknownDynamicComponentNameError'
        this.component = name
    }
}
