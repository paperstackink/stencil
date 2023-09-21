export default class UnknownDynamicComponentName extends Error {
    constructor(component, position) {
        super()

        this.name = 'UnknownDynamicComponentName'
        this.component = component
        this.position = position
    }
}
