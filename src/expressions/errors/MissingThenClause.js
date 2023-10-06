export default class MissingThenClause extends Error {
    constructor() {
        super()

        this.name = 'MissingThenClause'
        this.position = null
        this.expression = null
    }
}
