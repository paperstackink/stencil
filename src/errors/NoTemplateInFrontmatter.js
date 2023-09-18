export default class NoTemplateInFrontmatter extends Error {
    constructor(message) {
        super(message)

        this.name = 'NoTemplateInFrontmatter'
    }
}
