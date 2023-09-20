export default class ComponentNameNotProvided extends Error {
    constructor(position) {
        super(position)

        this.name = 'ComponentNameNotProvided'
        this.position = position
    }
}
