import NoEachDirectiveRecord from '@/errors/NoEachDirectiveRecord'
import UnevenIfDirectiveCount from '@/errors/UnevenIfDirectiveCount'
import NoEachDirectiveVariable from '@/errors/NoEachDirectiveVariable'
import NoIfDirectiveExpression from '@/errors/NoIfDirectiveExpression'
import UnevenEachDirectiveCount from '@/errors/UnevenEachDirectiveCount'
import MissingEachDirectiveExpression from '@/errors/MissingEachDirectiveExpression'

export default function (input) {
    let output = input

    //  If statements
    const openingIfStatements = [
        ...input.matchAll(/@if+\((?<expression>.*)\)/g),
    ]
    const closingIfStatements = [...input.matchAll(/@endif/g)]

    if (openingIfStatements.length !== closingIfStatements.length) {
        throw new UnevenIfDirectiveCount()
    }

    for (const match of openingIfStatements) {
        const lexeme = match[0]

        if (!match.groups.expression) {
            throw new NoIfDirectiveExpression()
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
        throw new MissingEachDirectiveExpression()
    }

    const openingForStatements = [
        ...input.matchAll(
            /@each\s*\(\s*(?<variable>\w+)\s*(?:,\s*(?<key>\w+)\s*)?(?:in\s*)?(?<record>.+)?\s*\)/g,
        ),
    ]
    const closingForStatements = [...input.matchAll(/@endeach/g)]

    if (openingForStatements.length !== closingForStatements.length) {
        throw new UnevenEachDirectiveCount()
    }

    for (const match of openingForStatements) {
        const lexeme = match[0]
        const variable = match.groups.variable
        const key = match.groups.key
        const inOperator = match.groups.in
        const record = match.groups.record

        if (!variable || variable === 'in') {
            throw new NoEachDirectiveVariable()
        }

        if (!record || record === 'in') {
            throw new NoEachDirectiveRecord()
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

    // Void components
    const voidComponents = output.matchAll(
        /<(?<name>[A-Z]\w+)(?<attributes>.*)\/>/g,
    )

    for (const match of voidComponents) {
        const lexeme = match[0]
        const name = match.groups.name
        const attributes = match.groups.attributes

        output = output.replace(lexeme, `<${name} ${attributes}></${name}>`)
    }

    // Slots
    const slots = output.matchAll(/<slot\s*(?<attributes>.*)\/>/g)

    for (const match of slots) {
        const lexeme = match[0]
        const attributes = match.groups.attributes

        output = output.replace(lexeme, `<slot ${attributes}></slot>`)
    }

    return output
}
