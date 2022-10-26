import { compile } from '@/index'

test('it removes fragments when rendering', async () => {
    const input = `
<div>
    <Fragment>
        <span>Element 1</span>
        <span>Element 2</span>
    </Fragment>
</div>
`
    const expected = `
<div>
    <span>Element 1</span>
    <span>Element 2</span>
</div>
`
    const result = await compile(input)

    expect(result).toBe(expected)
})
