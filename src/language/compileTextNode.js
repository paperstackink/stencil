import { unified } from 'unified'
import parse from 'rehype-parse-ns'

import isHtml from '@/helpers/isHtml'
import replaceExpressionWithValue from '@/helpers/replaceExpressionWithValue'

const stringToNodesWithResolvedExpressions = (source, values) => {
    let usedValues = []
    const pattern = /({{\w+}})/g

    const parts = source.split(pattern)
    const resolvedParts = parts.map(part => {
        const [result, usedValuesInExpression] = replaceExpressionWithValue(
            part,
            values,
        )

        usedValues = [...usedValues, ...usedValuesInExpression]

        return result
    })

    const result = resolvedParts
        .filter(part => part)
        .map(part => {
            if (isHtml(part)) {
                const node = unified()
                    .use(parse, { fragment: true })
                    .parse(part)

                return { ...node, meta: usedValues }
            }

            return {
                type: 'text',
                value: part,
                meta: {
                    usedValues,
                },
            }
        })

    return result
}

export default function (node, context) {
    const newNodes = stringToNodesWithResolvedExpressions(
        node.value,
        context.environment,
    )

    return newNodes
}
