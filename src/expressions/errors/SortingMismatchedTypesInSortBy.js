export default class SortingMismatchedTypesInSortBy extends Error {
    constructor(property, firstValue, firstType, secondValue, secondType) {
        super()

        this.name = 'SortingMismatchedTypesInSortBy'
        this.position = null
        this.expression = null
        this.property = property
        this.firstValue = firstValue
        this.firstType = firstType
        this.secondValue = secondValue
        this.secondType = secondType
    }
}
