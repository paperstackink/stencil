export default class UnknownTemplateInMarkdown extends Error {
    constructor(message) {
        super(message)

        this.name = 'UnknownTemplateInMarkdown'
    }
}
