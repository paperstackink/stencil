// Source: https://stackoverflow.com/a/55585398

export default function (input) {
    const trimmedInput = (input || '').replace('\n', '').trim()

    if (!trimmedInput) {
        return false
    }

    return !(input || '')
        .replace(/<([^>]+?)([^>]*?)>(.*?)<\/\1>/gi, '')
        .replace(/(<([^>]+)>)/gi, '')
        .trim()
}
