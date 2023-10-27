export default class UnclosedFunctionCall extends Error {
    constructor(character) {
        super()

        this.name = 'UnclosedFunctionCall'
        this.position = null
        this.expression = null
        this.character = character
    }
}
