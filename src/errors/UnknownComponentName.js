export default class UnknownComponentName extends Error {
    constructor(name, position) {
        super()

        this.name = 'UnknownComponentName'
        this.component = name
        this.position = position
    }
}
