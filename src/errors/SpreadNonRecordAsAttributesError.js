export default class SpreadNonRecordAsAttributesError extends Error {
    constructor(message) {
        super(message)

        this.name = 'SpreadNonRecordAsAttributesError'
    }
}
