import compileExpression from '@/language/compileExpression'
import extractExpressions from '@/helpers/extractExpressions'

const compileExpressions = (source, values) => {
    const expressions = extractExpressions(source)
    let output = source
    let usedIdentifiers = []

    expressions.forEach(([expression, lexeme]) => {
        const [resolved, usedIdentifiersInExpression] = compileExpression(
            expression,
            values,
        )
        usedIdentifiers = [...usedIdentifiers, ...usedIdentifiersInExpression]

        output = output.replace(lexeme, resolved)
    })

    return [output, usedIdentifiers]
}

export default compileExpressions
