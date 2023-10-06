export default class UnknownTemplateInMarkdown extends Error {
    constructor(component) {
        super(component)

        this.name = 'UnknownTemplateInMarkdown'
        this.component = component
    }
}
