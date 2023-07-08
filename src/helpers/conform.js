import CompilationError from '@/errors/CompilationError'

export default function (input) {
    let output = input

    //  If statements
    for (const match of input.matchAll(/@if+\((?<expression>.*)\)/g)) {
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
