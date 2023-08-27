import { unified } from 'unified'
import parse from 'rehype-parse-ns'
import stringify from 'rehype-stringify'
import format from 'rehype-format'
import { merge } from 'lodash'

import '@/setup'

import conform from '@/helpers/conform'
import isDocument from '@/helpers/isDocument'

import templates from '@/language/templates'
import extractData from '@/secondary/extractData'

import DumpSignal from '@/dumping/DumpSignal'

import Dump from '@/expressions/functions/Dump'
import compileDumpPage from '@/language/compileDumpPage'

import ReservedComponentNameError from '@/errors/ReservedComponentNameError'

const defaultContext = {
    components: {},
    environment: {
        global: {
            dump: new Dump(),
        },
        local: {},
    },
}

export const compile = async (input, providedContext = defaultContext) => {
    let context = merge({}, defaultContext, providedContext)

    if (
        ['Component', 'Data'].some(name =>
            context.components.hasOwnProperty(name),
        )
    ) {
        throw new ReservedComponentNameError()
    }

    try {
        const result = await unified()
            .use(parse, {
                fragment: !isDocument(input.trim()),
            })
            .use(templates, context)
            .use(format, {
                indent: 4,
            })
            .use(stringify, {
                closeSelfClosing: true,
            })
            .process(conform(input.trim()))

        return result.toString()
    } catch (error) {
        if (error instanceof DumpSignal) {
            const page = await compileDumpPage(error.data)

            return page
        } else {
            throw error
        }
    }
}

export { extractData }
