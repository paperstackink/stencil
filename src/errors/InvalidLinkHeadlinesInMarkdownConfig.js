export default class InvalidLinkHeadlinesInMarkdownConfig extends Error {
    constructor(value, options) {
        super()

        this.name = 'InvalidLinkHeadlinesInMarkdownConfig'
        this.value = value
        this.options = options
    }
}
