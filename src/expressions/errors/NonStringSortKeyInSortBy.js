export default class NonStringSortKeyInSortBy extends Error {
    constructor(type) {
        super()

        this.name = 'NonStringSortKeyInSortBy'
        this.position = null
        this.expression = null
        this.type = type
    }
}
