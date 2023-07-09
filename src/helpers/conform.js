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

        const condition = match.groups.expression.replaceAll(`"`, `\\"`)

        output = output.replace(lexeme, `<if condition="${condition}">`)
    }

    output = output.replaceAll('@endif', '</if>')

    return output
}
