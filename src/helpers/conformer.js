const removeWhitespaceInOutputExpressions = (input) => {
    let output = input
    const pattern = /{{\s*(?<name>\w*)\s*}}/g
    const expressions = input.matchAll(pattern)

    for (const match of expressions) {
        const groups = match.groups
        const name = groups.name
        const outputExpression = match[0]

        output = output.replace(outputExpression, `{{${name}}}`)
    }

    return output
}

export default function (input) {
    let output = input

    output = removeWhitespaceInOutputExpressions(input)

    return output
}
