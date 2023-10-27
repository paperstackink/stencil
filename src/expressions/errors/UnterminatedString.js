export default class UnterminatedString extends Error {
    constructor() {
        super()

        this.name = 'UnterminatedString'
        this.position = null
        this.expression = null
    }
}
