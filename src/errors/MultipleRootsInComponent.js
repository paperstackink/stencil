export default class MultipleRootsInComponent extends Error {
    constructor(definition) {
        super()

        this.name = 'MultipleRootsInComponent'
        this.definition = definition
    }
}
