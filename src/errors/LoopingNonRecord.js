export default class LoopingNonRecord extends Error {
    constructor(value, position) {
        super()

        this.name = 'LoopingNonRecord'
        this.value = value
        this.position = position
    }
}
