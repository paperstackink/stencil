export default class UnknownComponentNameError extends Error {
    constructor(name, position) {
        super()

        this.name = 'UnknownComponentNameError'
        this.component = name
        this.position = position
    }
}
