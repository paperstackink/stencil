export default class UnknownDynamicComponentName extends Error {
    constructor(name) {
        super()

        this.name = 'UnknownDynamicComponentName'
        this.component = name
    }
}
