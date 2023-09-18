export default class NoTemplateInMarkdownPage extends Error {
    constructor(message) {
        super(message)

        this.name = 'NoTemplateInMarkdownPage'
    }
}
