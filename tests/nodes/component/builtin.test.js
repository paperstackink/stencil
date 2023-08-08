import { compile } from '@/index'

test('it ignores Data components', async () => {
	const input = `
<div>
	<Data>
		layout: Article
	</Data>
    <span>Yo</span>
</div>
`
	const expected = `
<div>
    <span>Yo</span>
</div>
`

	const result = await compile(input)

	expect(result).toEqualIgnoringWhitespace(expected)
})
