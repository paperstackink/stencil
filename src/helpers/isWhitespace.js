export default function (input) {
    const trimmedInput = (input || '').replace('\n', '').trim()

    return trimmedInput.length === 0
}
