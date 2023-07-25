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
    // Check for empty @for directives:
    // Examples:
    // @for()
    // @for(  )
    if (input.match(/\s*@for\s*\(\s*\)\s*/g)) {
        throw new CompilationError('No expressions provided to @for directive.')
    }

    const openingForStatements = [
        ...input.matchAll(
            /@for\s*\(\s*(?<variable>\w+)\s*(?:,\s*(?<index>\w+)\s*)?(?:in\s*)?(?<record>.+)?\s*\)/g,
        ),
    ]
    const closingForStatements = [...input.matchAll(/@endfor/g)]

    if (openingForStatements.length !== closingForStatements.length) {
        throw new CompilationError(
            'There is an uneven number of opening and closing @for directives.',
        )
    }

    for (const match of openingForStatements) {
        const lexeme = match[0]
        const variable = match.groups.variable
        const index = match.groups.index
        const inOperator = match.groups.in
        const record = match.groups.record

        if (!variable || variable === 'in') {
            throw new CompilationError('No variable defined in @for directive.')
        }

        if (!record || record === 'in') {
            throw new CompilationError('No record defined in @for directive.')
        }

        if (index) {
            output = output.replace(
                lexeme,
                `<for variable="${variable.trim()}" record="${record.trim()}" index="${index.trim()}">`,
            )
        } else {
            output = output.replace(
                lexeme,
                `<for variable="${variable.trim()}" record="${record.trim()}">`,
            )
        }
    }

    output = output.replaceAll('@endfor', '</for>')

    return output
}
