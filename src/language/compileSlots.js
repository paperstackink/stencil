import compileSlot from '@/language/compileSlot'

export default function compileSlots(node, context) {
	if (node.type !== 'element' || node.tagName !== 'slot') {
		if (node.children) {
			let children = node.children.flatMap(child =>
				compileSlots(child, context),
			)
			return { ...node, children }
		} else {
			return node
		}
	}

	return compileSlot(node, context)
}
