export default class TooManyArguments extends Error {
    constructor(count) {
        super()

        this.name = 'TooManyArguments'
        this.position = null
        this.expression = null
        this.count = count
    }
}
