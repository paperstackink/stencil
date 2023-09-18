export default class SpreadNonRecordAsAttributes extends Error {
    constructor(message) {
        super(message)

        this.name = 'SpreadNonRecordAsAttributes'
    }
}
