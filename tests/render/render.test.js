import { compile } from '@/index'

test('it closes self-closing tags', async () => {
    const input = `<input>`
    const expected = `<input />`

    const result = await compile(input)

    expect(result).toBe(expected)
})

test('it collapses boolean attributes', async () => {
    const input = `<input disabled="true" />`
    const expected = `<input disabled />`

    const result = await compile(input)

    expect(result).toBe(expected)
})

test('it ignores Fragment', async () => {
    const input = `
<div>
    <Fragment>
        <p>Child 1</p>
        <p>Child 2</p>
    </Fragment>
</div>
`

    const expected = `
<div>
    <p>Child 1</p>
    <p>Child 2</p>
</div>
`

    const result = await compile(input)

    expect(result).toBe(expected)
})
