import { unified } from 'unified'
import parse from 'rehype-parse-ns'
import stringify from 'rehype-stringify'
import format from 'rehype-format'

import conform from '@/helpers/conformer'
import isDocument from '@/helpers/isDocument'

import templates from '@/language/templates'

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
        .use(templates, {
            environment: context.environment,
            components: context.components,
        })
        .use(format, {
            indent: 4,
        })
        .use(stringify, {
            closeSelfClosing: true,
        })
        .process(conformedInput)

    return result.toString()
}
