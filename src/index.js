import { unified } from 'unified'
import parse from 'rehype-parse-ns'
import stringify from 'rehype-stringify'
import format from 'rehype-format'

import components from '@/plugins/components'

const defaultContext = {
    components: {},
}

export const compile = async (input, context = defaultContext) => {
    const result = await unified()
        .use(parse, { fragment: true })
        .use(components, {
            components: context.components,
        })
        .use(format, {
            indent: 4,
        })
        .use(stringify)
        .process(input)

    return result.toString()
}
