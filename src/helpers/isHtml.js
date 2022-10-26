// Source: https://stackoverflow.com/a/55585398

export default function (input) {
    return !(input || '')
        .replace(/<([^>]+?)([^>]*?)>(.*?)<\/\1>/gi, '')
        .replace(/(<([^>]+)>)/gi, '')
        .trim()
}
