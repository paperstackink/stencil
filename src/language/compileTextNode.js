import { unified } from 'unified'
import parse from 'rehype-parse-ns'

import isHtml from '@/helpers/isHtml'
import replaceExpressionWithValue from '@/helpers/replaceExpressionWithValue'

const stringToNodesWithResolvedExpressions = (source, values) => {
    const pattern = /({{\w+}})/g

    const parts = source.split(pattern)
    const resolvedParts = parts.map((part) =>
        replaceExpressionWithValue(part, values),
    )

    return resolvedParts
        .filter(part => part)
        .map(part => {
            if (isHtml(part)) {
                return unified().use(parse, { fragment: true }).parse(part)
            }

            return {
                type: 'text',
                value: part,
            }
        })
}

export default function (node, values) {
    const newNodes = stringToNodesWithResolvedExpressions(node.value, values)

    return newNodes
}
