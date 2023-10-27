export default class UnknownLayoutInMarkdown extends Error {
    constructor(component) {
        super(component)

        this.name = 'UnknownLayoutInMarkdown'
        this.component = component
    }
}
