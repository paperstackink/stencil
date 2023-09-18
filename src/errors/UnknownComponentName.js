export default class UnknownComponentName extends Error {
    constructor(component, position) {
        super()

        this.name = 'UnknownComponentName'
        this.component = component
        this.position = position
    }
}
