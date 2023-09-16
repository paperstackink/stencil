export default class NoDefaultSlotInMarkdownTemplate extends Error {
    constructor(message) {
        super(message)

        this.name = 'NoDefaultSlotInMarkdownTemplate'
    }
}
