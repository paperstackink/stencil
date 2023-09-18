export default class ComponentNameNotProvided extends Error {
    constructor(message) {
        super(message)

        this.name = 'ComponentNameNotProvided'
    }
}
