export default class NoFrontMatter extends Error {
    constructor(message) {
        super(message)

        this.name = 'NoFrontMatter'
    }
}
