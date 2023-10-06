export default class ReservedComponentName extends Error {
    constructor(component) {
        super(component)

        this.name = 'ReservedComponentName'
        this.component = component
    }
}
