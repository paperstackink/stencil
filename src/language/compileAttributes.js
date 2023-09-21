import compileExpression from '@/language/compileExpression'
import compileExpressions from '@/language/compileExpressions'
import SpreadNonRecordAsAttributes from '@/errors/SpreadNonRecordAsAttributes'

export default function (properties, context, position) {
    let usedIdentifiers = []

    const attributes = Object.fromEntries(
        Object.entries(properties).flatMap(([name, value]) => {
            let newValue = value

            if (name === '#bind') {
                const [resolved, bindUsedIdentifiers] = compileExpression(
                    value,
                    {
                        ...context.environment.global,
                        ...context.environment.local,
                    },
                    false,
                )

                if (!(resolved.value instanceof Map)) {
                    throw new SpreadNonRecordAsAttributes(
                        position,
                        value,
                        resolved.value,
                    )
                }

                usedIdentifiers.concat(bindUsedIdentifiers)

                return [...resolved.value]
            } else if (name.startsWith('#')) {
                const attributeName = name.replace('#', '')
                const [resolved, bindUsedIdentifiers] = compileExpression(
                    value,
                    {
                        ...context.environment.global,
                        ...context.environment.local,
                    },
                    false,
                )

                usedIdentifiers.concat(bindUsedIdentifiers)

                return [[attributeName, resolved.value]]
            } else if (Array.isArray(value)) {
                newValue = value
                    .map(value => {
                        const [result, usedIdentifiersInAttribute] =
                            compileExpressions(value, {
                                ...context.environment.global,
                                ...context.environment.local,
                            })
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
                    {
                        ...context.environment.global,
                        ...context.environment.local,
                    },
                )
                usedIdentifiers = [
                    ...usedIdentifiers,
                    ...usedIdentifiersInAttribute,
                ]
                newValue = result
            }

            return [[name, newValue]]
        }),
    )

    return [attributes, usedIdentifiers]
}
