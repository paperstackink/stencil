import { unified } from 'unified'
import parse from 'rehype-parse-ns'
import stringify from 'rehype-stringify'
import format from 'rehype-format'

import conform from '@/helpers/conformer'

import components from '@/plugins/components'
import output from '@/plugins/output'

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
        .use(output, {
            values: context.environment,
        })
        .use(components, {
            components: context.components,
            environment: context.environment,
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
