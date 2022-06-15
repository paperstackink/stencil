import { unified } from 'unified'
import parse from 'rehype-parse-ns'
import stringify from 'rehype-stringify'
import format from 'rehype-format'

import conform from '@/helpers/conformer'

import components from '@/plugins/components'
import globalOutput from '@/plugins/global-output'

const defaultContext = {
    components: {},
    environment: {},
}

export const compile = async (input, providedContext = defaultContext) => {
    const context = {
        ...defaultContext,
        ...providedContext,
    }

    const result = await unified()
        .use(parse, { fragment: true })
        .use(globalOutput, {
            values: context.environment,
        })
        .use(components, {
            components: context.components,
        })
        .use(format, {
            indent: 4,
        })
        .use(stringify, {
            closeSelfClosing: true,
        })
        .process(conform(input))

    return result.toString()
}
