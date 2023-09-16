import yaml from 'yaml'
import parse from 'rehype-parse-ns'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import remarkFrontmatter from 'remark-frontmatter'
import { unified } from 'unified'
import { isPlainObject } from 'lodash'
import { find } from 'unist-util-find'
import stringify from 'rehype-stringify'

import isDocument from '@/helpers/isDocument'
import CompilationError from '@/errors/CompilationError'
import NoFrontMatterError from '@/errors/NoFrontMatterError'

function mapFromObject(object) {
	let entries = Object.entries(object)

	entries = entries.map(entry => {
		if (!isPlainObject(entry[1])) {
			return entry
		}

		return [entry[0], mapFromObject(entry[1])]
	})

	return new Map(entries)
}

const extract = node => {
	let data = new Map()

	if (node.type === 'element' && node.tagName === 'Data') {
		if (node.children.some(child => child.type !== 'text')) {
			throw new CompilationError(
				'Can not nest nodes inside <Data /> component.',
			)
		}

		const content = node.children.map(child => child.value).join('')

		const compiled = yaml.parse(content, {
			customTags: ['timestamp'],
		})

		data = new Map([...data, ...mapFromObject(compiled)])
	} else if (node.children) {
		node.children.forEach(child => {
			data = new Map([...data, ...extract(child)])
		})
	}

	return data
}

function plugin() {
	Object.assign(this, { Compiler: extract })
}

const extractDataFromStencil = async input => {
	const result = await unified()
		.use(parse, {
			fragment: !isDocument(input.trim()),
		})
		.use(plugin)
		.process(input.trim())

	return result.result
}

const extractDataFromMarkdown = async input => {
	let yamlContent

	await unified()
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

	return mapFromObject(frontMatter)
}

const extractData = async (input, options) => {
	if (options.type === 'markdown') {
		return extractDataFromMarkdown(input)
	}

	return extractDataFromStencil(input)
}

export default extractData
