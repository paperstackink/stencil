export default class NoLayoutInFrontmatter extends Error {
    constructor(message) {
        super(message)

        this.name = 'NoLayoutInFrontmatter'
    }
}
