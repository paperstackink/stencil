import NestedExpression from '@/errors/NestedExpression'
import UnclosedExpression from '@/errors/UnclosedExpression'

const normaliseExpressionsInAttributes = (attributes, position) => {
    return Object.fromEntries(
        Object.entries(attributes).map(([name, value]) => {
            if (!Array.isArray(value)) {
                if (typeof value !== 'string') {
                    return [name, value]
                }

                const expressionDelimiters = [...value.matchAll(/{{|}}/g)] // All '{{'s and '}}'s

                // Fail with unclosed expression
                if (expressionDelimiters.length % 2 !== 0) {
                    throw new UnclosedExpression(position)
                }

                // Check for nested expressions
                expressionDelimiters.forEach(([delimiter], index) => {
                    const even = index % 2 === 0

                    if (!even && delimiter === '}}') {
                        return
                    }
                    if (even && delimiter === '{{') {
                        return
                    }

                    throw new NestedExpression(position)
                })

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
                    throw new UnclosedExpression(position)
                }

                if (
                    nextExpressionOpenerIndex !== -1 &&
                    nextExpressionOpenerIndex < expressionCloserIndex
                ) {
                    throw new NestedExpression(position)
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
