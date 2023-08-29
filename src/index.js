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

import CompilationError from '@/errors/CompilationError'
import UnknownComponentNameError from '@/errors/UnknownComponentNameError'
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

export const compile = async (
    input,
    providedContext = defaultContext,
    meta,
) => {
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
        } else if (error instanceof UnknownComponentNameError) {
            function getCharacterDiffCount(a, b) {
                return a.split('').filter((character, index) => {
                    return character !== b.charAt(index)
                }).length
            }

            function digits(number) {
                return number.toString().length
            }

            const componentNames = Object.keys(context.components)
            const suggestedComponents = componentNames.filter(
                name => getCharacterDiffCount(error.component, name) === 1,
            )

            const suggestions = suggestedComponents
                .map(name => `     ${name}`)
                .join('\n')

            const relevantLines = input
                .split('\n')
                .map((content, index) => {
                    const lineNumber = index + 1
                    const errorLineNumber = error.position.start.line
                    const diff = lineNumber - errorLineNumber
                    if (diff === 0 || Math.abs(diff) === 1) {
                        return {
                            number: lineNumber,
                            content,
                        }
                    } else {
                        return null
                    }
                })
                .filter(Boolean)
            const codeContext = relevantLines
                .map(line => {
                    // Find the number of digits in a line number in relevant lines
                    // So we can calculate the number of padded spaces we need to add to align all lines
                    const maxLineNumberLength = digits(
                        Math.max(...relevantLines.map(line => line.number)),
                    )
                    const lineNumberLength = digits(line.number)
                    const padding = Array.from(
                        new Array(maxLineNumberLength - lineNumberLength + 1),
                    )
                        .map(_ => ' ')
                        .join('')

                    return `${line.number}${padding}| ${line.content}`
                })
                .join('\n')

            const output = `
-----  Error: Unknown component name  ----------------------
You tried to use a component called "${error.component}" but there are no components with that name.

The error occured in "${meta.path}":
${codeContext}

It might be one of these components instead:
${suggestions}
`

            throw new CompilationError(output)
        } else {
            throw error
        }
    }
}

export { extractData, CompilationError }
