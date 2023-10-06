export default class UnfinishedPropertyAccess extends Error {
    constructor() {
        super()

        this.name = 'UnfinishedPropertyAccess'
        this.position = null
        this.expression = null
    }
}
