const extractExpressions = source => {
    const pattern = /{{(?<expression>.*?)}}/g
    const expressions = [...source.matchAll(pattern)].map(match => {
        const groups = match.groups
        const expression = groups.expression
        const lexeme = match[0]

        return [expression, lexeme]
    })

    return expressions
}

export default extractExpressions
