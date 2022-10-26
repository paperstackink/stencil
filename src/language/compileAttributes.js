import replaceExpressionWithValue from '@/helpers/replaceExpressionWithValue'

export default function (properties, context) {
    let usedValues = []

    const attributes = Object.fromEntries(
        Object.entries(properties).map(([name, value]) => {
            let newValue = value

            if (Array.isArray(value)) {
                newValue = value
                    .map(value => {
                        const [result, usedValuesInAttribute] =
                            replaceExpressionWithValue(
                                value,
                                context.environment,
                            )
                        usedValues = [...usedValues, ...usedValuesInAttribute]

                        return result
                    })
                    .join(' ')
            } else if (typeof value === 'string') {
                const [result, usedValuesInAttribute] =
                    replaceExpressionWithValue(value, context.environment)
                usedValues = [...usedValues, ...usedValuesInAttribute]
                newValue = result
            }

            return [name, newValue]
        }),
    )

    return [attributes, usedValues]
}
