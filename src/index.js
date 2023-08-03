import { unified } from 'unified'
import parse from 'rehype-parse-ns'
import stringify from 'rehype-stringify'
import format from 'rehype-format'

import conform from '@/helpers/conform'
import isDocument from '@/helpers/isDocument'

import templates from '@/language/templates'

import Debug from '@/expressions/functions/Debug'

const defaultContext = {
    components: {},
    environment: {},
}

export const compile = async (input, providedContext = defaultContext) => {
    let context = {
        ...defaultContext,
        ...providedContext,
    }

    context.environment = {
        ...context.environment,
        debug: new Debug(),
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
        .process(conform(input.trim()))

    return result.toString()
}
