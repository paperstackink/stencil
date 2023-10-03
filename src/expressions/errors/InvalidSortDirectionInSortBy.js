export default class InvalidSortDirectionInSortBy extends Error {
    constructor(direction) {
        super()

        this.name = 'InvalidSortDirectionInSortBy'
        this.position = null
        this.expression = null
        this.direction = direction
    }
}
