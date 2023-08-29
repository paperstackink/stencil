export default class CompilationError extends Error {
    constructor(output) {
        super()

        this.name = 'CompilationError'
        this.output = output
    }
}
