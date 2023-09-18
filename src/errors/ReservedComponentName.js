export default class ReservedComponentName extends Error {
    constructor(message) {
        super(message)

        this.name = 'ReservedComponentName'
    }
}
