export default class UnevenEachDirectiveCount extends Error {
    constructor(position) {
        super()

        this.name = 'UnevenEachDirectiveCount'
        this.position = position
    }
}
