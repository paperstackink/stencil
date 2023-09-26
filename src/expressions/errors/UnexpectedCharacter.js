export default class UnexpectedCharacter extends Error {
    constructor(character) {
        super()

        this.name = 'UnexpectedCharacter'
        this.position = null
        this.character = character
    }
}
