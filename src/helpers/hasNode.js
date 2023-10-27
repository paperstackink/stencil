import { unified } from 'unified'
import parse from 'rehype-parse-ns'
import stringify from 'rehype-stringify'

import conform from '@/helpers/conform'
import isDocument from '@/helpers/isDocument'
import { find } from 'unist-util-find'

export default async function (source, node) {
	let hasNode = false

	const result = await unified()
		.use(parse, {
			fragment: !isDocument(source),
		})
		.use(() => tree => {
			const element = find(tree, { type: 'element', tagName: node })

			if (element) {
				hasNode = true
			}
		})
		.use(stringify)
		.process(conform(source))

	return hasNode
}
