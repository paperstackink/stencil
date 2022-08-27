import { unified } from 'unified'
import parse from 'rehype-parse-ns'
import stringify from 'rehype-stringify'
import format from 'rehype-format'

import conform from '@/helpers/conformer'
import isDocument from '@/helpers/isDocument'

import output from '@/plugins/output'
import fragments from '@/plugins/fragments'
import components from '@/plugins/components'

const defaultContext = {
    components: {},
    environment: {},
}

export const compile = async (input, providedContext = defaultContext) => {
    const context = {
        ...defaultContext,
        ...providedContext,
    }

    const conformedInput = conform(input)

    const result = await unified()
        .use(parse, {
            fragment: !isDocument(conformedInput),
        })
        .use(output, {
            values: context.environment,
        })
        .use(components, {
            components: context.components,
            environment: context.environment,
        })
        .use(fragments)
        .use(format, {
            indent: 4,
        })
        .use(stringify, {
            closeSelfClosing: true,
        })
        .process(conformedInput)

    return result.toString()
}
