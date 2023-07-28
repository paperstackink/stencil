import CompilationError from '@/errors/CompilationError'

export default function (input) {
    let output = input

    //  If statements
    const openingIfStatements = [
        ...input.matchAll(/@if+\((?<expression>.*)\)/g),
    ]
    const closingIfStatements = [...input.matchAll(/@endif/g)]

    if (openingIfStatements.length !== closingIfStatements.length) {
        throw new CompilationError(
            'There is an uneven number of opening and closing @if directives.',
        )
    }

    for (const match of openingIfStatements) {
        const lexeme = match[0]

        if (!match.groups.expression) {
            throw new CompilationError(
                'No expressions provided to @if directive.',
            )
        }

        const condition = encodeURI(match.groups.expression)

        output = output.replace(lexeme, `<if condition="${condition}">`)
    }

    output = output.replaceAll('@endif', '</if>')

    // For loops
    // Check for empty @each directives:
    // Examples:
    // @each()
    // @each(  )
    if (input.match(/\s*@each\s*\(\s*\)\s*/g)) {
        throw new CompilationError(
            'No expressions provided to @each directive.',
        )
    }

    const openingForStatements = [
        ...input.matchAll(
            /@each\s*\(\s*(?<variable>\w+)\s*(?:,\s*(?<key>\w+)\s*)?(?:in\s*)?(?<record>.+)?\s*\)/g,
        ),
    ]
    const closingForStatements = [...input.matchAll(/@endeach/g)]

    if (openingForStatements.length !== closingForStatements.length) {
        throw new CompilationError(
            'There is an uneven number of opening and closing @each directives.',
        )
    }

    for (const match of openingForStatements) {
        const lexeme = match[0]
        const variable = match.groups.variable
        const key = match.groups.key
        const inOperator = match.groups.in
        const record = match.groups.record

        if (!variable || variable === 'in') {
            throw new CompilationError(
                'No variable defined in @each directive.',
            )
        }

        if (!record || record === 'in') {
            throw new CompilationError('No record defined in @each directive.')
        }

        if (key) {
            output = output.replace(
                lexeme,
                `<each variable="${variable.trim()}" record="${record.trim()}" key="${key.trim()}">`,
            )
        } else {
            output = output.replace(
                lexeme,
                `<each variable="${variable.trim()}" record="${record.trim()}">`,
            )
        }
    }

    output = output.replaceAll('@endeach', '</each>')

    return output
}
