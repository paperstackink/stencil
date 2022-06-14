export default class CompilationError extends Error {
    constructor(message) {
        super(message)

        this.name = 'CompilationError'
    }
}
