export default class NoFrontMatterError extends Error {
    constructor(message) {
        super(message)

        this.name = 'NoFrontMatterError'
    }
}
