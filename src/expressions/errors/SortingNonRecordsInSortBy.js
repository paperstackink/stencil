export default class SortingNonRecordsInSortBy extends Error {
    constructor(type, value, property) {
        super()

        this.name = 'SortingNonRecordsInSortBy'
        this.position = null
        this.expression = null
        this.type = type
        this.value = value
        this.property = property
    }
}
