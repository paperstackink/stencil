export default class NoDefaultSlotInMarkdownLayout extends Error {
    constructor(message) {
        super(message)

        this.name = 'NoDefaultSlotInMarkdownLayout'
    }
}
