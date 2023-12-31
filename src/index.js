import { unified } from 'unified'
import parse from 'rehype-parse-ns'
import stringify from 'rehype-stringify'
import format from 'rehype-format'
import { merge } from 'lodash'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import remarkFrontmatter from 'remark-frontmatter'
import remarkExternalLinks from 'remark-external-links'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { find } from 'unist-util-find'
import yaml from 'yaml'

import '@/setup'

import conform from '@/helpers/conform'
import hasNode from '@/helpers/hasNode'
import isDocument from '@/helpers/isDocument'
import formatError from '@/helpers/formatError'

import templates from '@/language/templates'
import extractData from '@/secondary/extractData'

import { table } from '@/markdown/handlers/table'

import DumpSignal from '@/dumping/DumpSignal'

import Dump from '@/expressions/functions/Dump'
import compileDumpPage from '@/language/compileDumpPage'

import NoFrontMatter from '@/errors/NoFrontMatter'
import CompilationError from '@/errors/CompilationError'
import EmptyFrontmatter from '@/errors/EmptyFrontmatter'
import ReservedComponentName from '@/errors/ReservedComponentName'
import NoLayoutInFrontmatter from '@/errors/NoLayoutInFrontmatter'
import UnknownLayoutInMarkdown from '@/errors/UnknownLayoutInMarkdown'
import NoDefaultSlotInMarkdownLayout from '@/errors/NoDefaultSlotInMarkdownLayout'
import InvalidLinkHeadlinesInMarkdownConfig from '@/errors/InvalidLinkHeadlinesInMarkdownConfig'

const defaultContext = {
    config: {
        markdown: {
            linkHeadlines: null,
            openExternalLinksInNewTab: true,
        },
    },
    components: {},
    environment: {
        global: {},
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

    if (providedContext.config) {
        context = merge({}, context, {
            environment: {
                global: {
                    dump: new Dump(),
                    $config: Map.fromObject(providedContext.config),
                },
            },
        })
    }

    let input = providedInput.trim()

    const reservedComponentName = ['Component', 'Data'].find(name =>
        context.components.hasOwnProperty(name),
    )

    if (reservedComponentName) {
        throw formatError(
            input,
            new ReservedComponentName(reservedComponentName),
            options,
            context,
        )
    }

    if (options.language === 'markdown') {
        try {
            let hasYamlSection = false
            let yamlContent

            let parser = unified().use(remarkParse)

            if (context.config.markdown.openExternalLinksInNewTab) {
                parser = parser.use(remarkExternalLinks)
            }

            parser = parser
                .use(remarkFrontmatter, ['yaml'])
                .use(remarkGfm)
                .use(() => tree => {
                    const node = find(tree, { type: 'yaml' })

                    if (node) {
                        hasYamlSection = true
                        yamlContent = node.value
                    }
                })
                .use(remarkRehype, {
                    allowDangerousHtml: true,
                    handlers: {
                        table,
                    },
                })

            if (context.config.markdown.linkHeadlines) {
                const options = [
                    null,
                    'wrap',
                    'after',
                    'append',
                    'before',
                    'prepend',
                ]
                if (!options.includes(context.config.markdown.linkHeadlines)) {
                    throw new InvalidLinkHeadlinesInMarkdownConfig(
                        context.config.markdown.linkHeadlines,
                        options,
                    )
                }
                parser = parser.use(rehypeSlug).use(rehypeAutolinkHeadings, {
                    behavior: context.config.markdown.linkHeadlines,
                })
            }

            const parsed = await parser
                .use(stringify, { allowDangerousHtml: true })
                .process(input)

            if (!hasYamlSection) {
                throw new NoFrontMatter()
            }

            if (!yamlContent) {
                throw new EmptyFrontmatter()
            }

            const frontMatter = yaml.parse(yamlContent, {
                customTags: ['timestamp'],
            })

            if (!frontMatter.hasOwnProperty('layout')) {
                throw new NoLayoutInFrontmatter()
            }

            if (!context.components.hasOwnProperty(frontMatter.layout)) {
                throw new UnknownLayoutInMarkdown(frontMatter.layout)
            }

            const hasDefaultSlot = await hasNode(
                context.components[frontMatter.layout],
                'slot',
            )

            if (!hasDefaultSlot) {
                throw new NoDefaultSlotInMarkdownLayout()
            }

            const content = String(parsed)

            input = `<${frontMatter.layout}>${content}</${frontMatter.layout}>`
        } catch (error) {
            throw formatError(input, error, options, context)
        }
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
            throw formatError(input, error, options, context)
        }
    }
}

export { extractData, CompilationError }
