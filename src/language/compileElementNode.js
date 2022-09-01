import replaceExpressionWithValue from '@/helpers/replaceExpressionWithValue'

export default function (node, values) {
    const properties = Object.fromEntries(
        Object.entries(node.properties).map(([name, value]) => {
            let newValue = value

            if (Array.isArray(value)) {
                newValue = value.map(value => {
                    return replaceExpressionWithValue(value, values)
                })
            } else if (typeof value === 'string') {
                newValue = replaceExpressionWithValue(value, values)
            }

            return [name, newValue]
        }),
    )

    node.properties = properties

    return [node]
}
