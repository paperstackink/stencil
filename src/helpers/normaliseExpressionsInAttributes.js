import NestedExpression from '@/errors/NestedExpression'
import UnclosedExpression from '@/errors/UnclosedExpression'

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
                    throw new UnclosedExpression()
                }

                if (
                    nextExpressionOpenerIndex !== -1 &&
                    nextExpressionOpenerIndex < expressionCloserIndex
                ) {
                    throw new NestedExpression()
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
