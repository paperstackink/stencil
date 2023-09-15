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
import isDocument from '@/helpers/isDocument'

import templates from '@/language/templates'
import extractData from '@/secondary/extractData'

import DumpSignal from '@/dumping/DumpSignal'

import NoFrontMatterError from '@/errors/NoFrontMatterError'
import UnknownTemplateInMarkdown from '@/errors/UnknownTemplateInMarkdown'
import NoTemplateInMarkdownPageError from '@/errors/NoTemplateInMarkdownPageError'

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

const defaultOptions = {
    language: 'stencil',
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

    if (options.language === 'mds') {
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
        } else {
            throw error
        }
    }
}

export { extractData }
