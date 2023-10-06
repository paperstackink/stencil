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
import formatError from '@/helpers/formatError'

import NoFrontMatter from '@/errors/NoFrontMatter'
import EmptyFrontmatter from '@/errors/EmptyFrontmatter'
import NodeNestedInsideDataNode from '@/errors/NodeNestedInsideDataNode'

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
		const child = node.children.find(child => child.type !== 'text')
		if (child) {
			throw new NodeNestedInsideDataNode(child.position)
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
	let hasYamlSection = false
	let yamlContent

	await unified()
		.use(remarkParse)
		.use(remarkFrontmatter, ['yaml'])
		.use(() => tree => {
			const node = find(tree, { type: 'yaml' })

			if (node) {
				yamlContent = node.value
				hasYamlSection = true
			}
		})
		.use(remarkRehype, { allowDangerousHtml: true })
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

	return mapFromObject(frontMatter)
}

const extractData = async (input, options) => {
	try {
		// Await so it throws error before returning
		const data = await (options.language === 'markdown'
			? extractDataFromMarkdown(input)
			: extractDataFromStencil(input))

		return data
	} catch (error) {
		throw formatError(input, error, options)
	}
}

export default extractData
