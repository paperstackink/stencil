export default class MissingElseClause extends Error {
    constructor() {
        super()

        this.name = 'MissingElseClause'
        this.position = null
        this.expression = null
    }
}
