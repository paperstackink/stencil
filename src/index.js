import { unified } from 'unified'
import parse from 'rehype-parse-ns'
import stringify from 'rehype-stringify'
import format from 'rehype-format'
import { merge } from 'lodash'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import remarkFrontmatter from 'remark-frontmatter'
import { find } from 'unist-util-find'
import yaml from 'yaml'

import '@/setup'

import conform from '@/helpers/conform'
import hasNode from '@/helpers/hasNode'
import isDocument from '@/helpers/isDocument'

import templates from '@/language/templates'
import extractData from '@/secondary/extractData'

import DumpSignal from '@/dumping/DumpSignal'

import NoFrontMatterError from '@/errors/NoFrontMatterError'
import UnknownTemplateInMarkdown from '@/errors/UnknownTemplateInMarkdown'
import NoTemplateInMarkdownPageError from '@/errors/NoTemplateInMarkdownPageError'
import NoDefaultSlotInMarkdownTemplate from '@/errors/NoDefaultSlotInMarkdownTemplate'

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

const defaultOptions = {
    language: 'stencil',
    path: '',
}

export const compile = async (
    providedInput,
    providedContext = defaultContext,
    options = defaultOptions,
) => {
    let context = merge({}, defaultContext, providedContext)

    if (
        ['Component', 'Data'].some(name =>
            context.components.hasOwnProperty(name),
        )
    ) {
        throw new ReservedComponentNameError()
    }

    let input = providedInput.trim()

    if (options.language === 'markdown') {
        let yamlContent
        const parsed = await unified()
            .use(remarkParse)
            .use(remarkFrontmatter, ['yaml'])
            .use(() => tree => {
                const node = find(tree, { type: 'yaml' })

                if (node) {
                    yamlContent = node.value
                }
            })
            .use(remarkRehype, { allowDangerousHtml: true })
            .use(stringify, { allowDangerousHtml: true })
            .process(input)

        if (!yamlContent) {
            throw new NoFrontMatterError()
        }

        const frontMatter = yaml.parse(yamlContent, {
            customTags: ['timestamp'],
        })

        if (!frontMatter.hasOwnProperty('template')) {
            throw new NoTemplateInMarkdownPageError()
        }

        if (!context.components.hasOwnProperty(frontMatter.template)) {
            throw new UnknownTemplateInMarkdown()
        }

        const hasDefaultSlot = await hasNode(
            context.components[frontMatter.template],
            'slot',
        )

        if (!hasDefaultSlot) {
            throw new NoDefaultSlotInMarkdownTemplate()
        }

        const content = String(parsed)

        input = `<${frontMatter.template}>${content}</${frontMatter.template}>`
    }

    try {
        const result = await unified()
            .use(parse, {
                fragment: !isDocument(input),
            })
            .use(templates, context)
            .use(format, {
                indent: 4,
            })
            .use(stringify, {
                closeSelfClosing: true,
            })
            .process(conform(input))

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
                name =>
                    getCharacterDiffCount(error.component, name) === 1 &&
                    getCharacterDiffCount(name, error.component) === 1,
            )

            const suggestions = suggestedComponents.length
                ? `\nIt might be one of these components instead:\n` +
                  suggestedComponents.map(name => `     ${name}`).join('\n')
                : ''

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

The error occured in "${options.path}":
${codeContext}
${suggestions}
`

            throw new CompilationError(output)
        } else {
            throw error
        }
    }
}

export { extractData, CompilationError }
