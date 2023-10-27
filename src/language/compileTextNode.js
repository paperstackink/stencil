import { unified } from 'unified'
import parse from 'rehype-parse-ns'

import isHtml from '@/helpers/isHtml'
import compileExpressions from '@/language/compileExpressions'

const stringToNodesWithResolvedExpressions = (source, values, position) => {
    let usedIdentifiers = []
    const pattern = /({{\w+}})/g

    const parts = source.split(pattern)
    const resolvedParts = parts.map(part => {
        const [result, usedIdentifiersInExpression] = compileExpressions(
            part,
            values,
            position,
        )

        usedIdentifiers = [...usedIdentifiers, ...usedIdentifiersInExpression]

        return result
    })

    const result = resolvedParts
        .filter(part => part)
        .map(part => {
            if (isHtml(part)) {
                const node = unified()
                    .use(parse, { fragment: true })
                    .parse(part)

                return { ...node, meta: usedIdentifiers }
            }

            return {
                type: 'text',
                value: part,
                meta: {
                    usedIdentifiers,
                },
            }
        })

    return result
}

export default function (node, context) {
    const newNodes = stringToNodesWithResolvedExpressions(
        node.value,
        {
            ...context.environment.global,
            ...context.environment.local,
        },
        node.position,
    )

    return newNodes
}
