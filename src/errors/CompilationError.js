export default class CompilationError extends Error {
    constructor(original, output) {
        super()

        this.name = 'CompilationError'
        this.original = original
        this.output = output
    }
}
