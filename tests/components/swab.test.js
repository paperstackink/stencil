import { compile } from '@/index'

test('it can inject a normal component', async () => {
    const input = `
<div>
    <Card></Card>
</div>
`
    const componentDefiniton = `
<section class="card">
    <div>This is a card</div>
</section>
`
    const expected = `
<div>
    <section class="card">
        <div>This is a card</div>
    </section>
</div>
`

    const result = await compile(input, {
        components: { Card: componentDefiniton },
    })

    expect(result).toBe(expected)
})

test('it can inject a void component', async () => {
    const input = `
<div>
    <Card />
</div>
`
    const componentDefiniton = `
<section class="card">
    <div>This is a card</div>
</section>
`
    const expected = `
<div>
    <section class="card">
        <div>This is a card</div>
    </section>
</div>
`

    const result = await compile(input, {
        components: { Card: componentDefiniton },
    })

    expect(result).toBe(expected)
})
