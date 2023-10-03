import extractData from '@/secondary/extractData'

import NoFrontMatter from '@/errors/NoFrontMatter'
import EmptyFrontmatter from '@/errors/EmptyFrontmatter'
import NodeNestedInsideDataNode from '@/errors/NodeNestedInsideDataNode'

describe('Stencil', () => {
	test('it extracts data from a top-level Data component', async () => {
		const input = `
<Data>
	layout: Article
</Data>
`
		const expected = new Map([['layout', 'Article']])

		const result = await extractData(input, { type: 'stencil' })

		expect(result).toEqual(expected)
	})

	test('it extracts data from a nested Data component', async () => {
		const input = `
<div>
	<span>
		<Data>
			layout: Article
		</Data>
	</span>
</div>
`
		const expected = new Map([['layout', 'Article']])

		const result = await extractData(input, { type: 'stencil' })

		expect(result).toEqual(expected)
	})

	test("it doesn't extract data from inside a component", async () => {
		const input = `
<div>
	<span>
		<Card />
	</span>
</div>
`
		const Component = `
<div>
	<Data>
		layout: Article
	</Data>
</div>
`

		const expected = new Map()

		const result = await extractData(input, { type: 'stencil' })

		expect(result).toEqual(expected)
	})

	test('it compiles data inside as yaml', async () => {
		const input = `
<Data>
    string: 'string'
    integer: 25
    float: 2.5
    boolean: true
    date: 2024-12-24
    nested:
        key: 'nested'
    list:
        - item 1
        - item 2
        - item 3
</Data>
`
		const expected = new Map([
			['date', new Date('2024-12-24')],
			['float', 2.5],
			['integer', 25],
			['boolean', true],
			['string', 'string'],
			['nested', new Map([['key', 'nested']])],
			['list', ['item 1', 'item 2', 'item 3']],
		])

		const result = await extractData(input, { type: 'stencil' })

		expect(result).toEqual(expected)
	})

	test('it merges Data components if there is more than 1', async () => {
		const input = `
<div>
    <Data>
        first: 'first'
        overlapping: false
    </Data>
    <div>
        <Data>
            second: 'second'
            overlapping: true
        </Data>
    </div>
</div>
`
		const expected = new Map([
			['first', 'first'],
			['second', 'second'],
			['overlapping', true],
		])

		const result = await extractData(input, { type: 'stencil' })

		expect(result).toEqual(expected)
	})

	test('it fails if the Data component contains other nodes', async () => {
		const input = `
<Data>
	layout: Article
	<span>Yo</span>
</Data>
`

		await expect(
			extractData(input, { type: 'stencil' }),
		).rejects.toThrowCompilationError(NodeNestedInsideDataNode)
	})
})

describe('Markdown', () => {
	test('it extracts data from frontmatter', async () => {
		const input = `---
featured: true
---

# Headline 1
`
		const expected = new Map([['featured', true]])

		const result = await extractData(input, { language: 'markdown' })

		expect(result).toEqual(expected)
	})

	test('it fails if there is no front matter block', async () => {
		const input = `
# Headline 1
`

		await expect(
			extractData(input, { language: 'markdown' }),
		).rejects.toThrowCompilationError(NoFrontMatter)
	})

	test('it fails if there is an empty front matter block', async () => {
		const input = `---

---

# Headline 1
`

		await expect(
			extractData(input, { language: 'markdown' }),
		).rejects.toThrowCompilationError(EmptyFrontmatter)
	})
})
