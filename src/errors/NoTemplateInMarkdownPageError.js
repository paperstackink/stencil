export default class NoTemplateInMarkdownPageError extends Error {
    constructor(message) {
        super(message)

        this.name = 'NoTemplateInMarkdownPageError'
    }
}
