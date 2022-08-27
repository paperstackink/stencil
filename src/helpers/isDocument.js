export default function (input) {
    const processedInput = input.trim().toLowerCase()

    return (
        processedInput.startsWith('<html') ||
        processedInput.startsWith('<!doctype')
    )
}
