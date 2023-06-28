import { unified } from 'unified'
import parse from 'rehype-parse-ns'
import stringify from 'rehype-stringify'
import format from 'rehype-format'

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

    const result = await unified()
        .use(parse, {
            fragment: !isDocument(input.trim()),
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
        .process(input.trim())

    return result.toString()
}
