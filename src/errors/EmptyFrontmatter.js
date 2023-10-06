export default class EmptyFrontmatter extends Error {
    constructor(message) {
        super(message)

        this.name = 'EmptyFrontmatter'
        this.position = { start: { line: 2 } }
    }
}
