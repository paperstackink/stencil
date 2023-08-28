import { compile } from '@/index'

test('a component attribute is not available in a nested attributes scope', async () => {
	const input = `<Parent value="Yo" />`
	const parentDefinition = `<div>
		<span>{{ value }}</span>
		<Child />
	</div>`
	const childDefinition = `<span>
		{{ value }}
	</span>`

	const expected = `<div>
		<span>Yo</span>
		<span></span>
	</div>`
	const result = await compile(input, {
		environment: {},
		components: {
			Parent: parentDefinition,
			Child: childDefinition,
		},
	})
	expect(result).toEqualIgnoringWhitespace(expected)
})
