export default class DumpSignal extends Error {
    constructor(data) {
        super()

        this.name = 'DumpSignal'
        this.data = data
    }
}
