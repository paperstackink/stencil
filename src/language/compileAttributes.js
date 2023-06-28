import compileExpressions from '@/language/compileExpressions'

export default function (properties, context) {
    let usedIdentifiers = []

    const attributes = Object.fromEntries(
        Object.entries(properties).map(([name, value]) => {
            let newValue = value

            if (Array.isArray(value)) {
                newValue = value
                    .map(value => {
                        const [result, usedIdentifiersInAttribute] =
                            compileExpressions(value, context.environment)
                        usedIdentifiers = [
                            ...usedIdentifiers,
                            ...usedIdentifiersInAttribute,
                        ]

                        return result
                    })
                    .join(' ')
            } else if (typeof value === 'string') {
                const [result, usedIdentifiersInAttribute] = compileExpressions(
                    value,
                    context.environment,
                )
                usedIdentifiers = [
                    ...usedIdentifiers,
                    ...usedIdentifiersInAttribute,
                ]
                newValue = result
            }

            return [name, newValue]
        }),
    )

    return [attributes, usedIdentifiers]
}
