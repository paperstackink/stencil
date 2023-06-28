import CompilationError from '@/errors/CompilationError'

const normaliseExpressionsInAttributes = attributes => {
    return Object.fromEntries(
        Object.entries(attributes).map(([name, value]) => {
            if (!Array.isArray(value)) {
                return [name, value]
            }

            let newValue = value

            while (newValue.find(piece => piece.endsWith('{{'))) {
                const expressionOpenerIndex = value.findIndex(piece =>
                    piece.endsWith('{{'),
                )

                const nextExpressionOpenerIndex = value.findIndex(
                    (piece, index) => {
                        return (
                            index !== expressionOpenerIndex &&
                            piece.endsWith('{{')
                        )
                    },
                )

                const expressionCloserIndex = value.findIndex(
                    piece => !piece.startsWith('{{') && piece.endsWith('}}'),
                )

                if (expressionCloserIndex === -1) {
                    throw new CompilationError('Unclosed expression.')
                }

                if (
                    nextExpressionOpenerIndex !== -1 &&
                    nextExpressionOpenerIndex < expressionCloserIndex
                ) {
                    throw new CompilationError(
                        'Nested expressions are not supported.',
                    )
                }

                if (
                    Number.isInteger(expressionOpenerIndex) &&
                    Number.isInteger(expressionCloserIndex)
                ) {
                    const unifiedExpression = value
                        .slice(expressionOpenerIndex, expressionCloserIndex + 1)
                        .join(' ')

                    newValue.splice(
                        expressionOpenerIndex,
                        expressionCloserIndex - expressionOpenerIndex + 1,
                        unifiedExpression,
                    )
                }
            }

            return [name, newValue]
        }),
    )
}

export default normaliseExpressionsInAttributes
