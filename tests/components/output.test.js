import { compile } from '@/index'
import CompilationError from '@/errors/CompilationError'

test('it can output a global value', async () => {
    const input = `
<div>
    <Card />
</div>
`
    const componentDefiniton = `
<section class="card">
    <div>This is a {{ value }}</div>
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
        environment: { value: 'card' },
    })

    expect(result).toBe(expected)
})

test('it can output a local value', async () => {
    const input = `
<div>
    <Card value="card" />
</div>
`
    const componentDefiniton = `
<section class="card">
    <div>This is a {{ value }}</div>
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
        environment: {},
    })

    expect(result).toBe(expected)
})

test('it can output a value in a text child', async () => {
    const input = `
<div>
    <Card />
</div>
`
    const componentDefiniton = `
<section class="card">
    <div>This is a {{ value }}</div>
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
        environment: { value: 'card' },
    })

    expect(result).toBe(expected)
})

test('it can output a value in an attribute', async () => {
    const input = `
<div>
    <Card />
</div>
`
    const componentDefiniton = `
<section class="{{ class }}">
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
        environment: { class: 'card' },
    })

    expect(result).toBe(expected)
})

test('a global value can be overriden by a local value', async () => {
    const input = `
<div>
    <Card value="local" />
</div>
`
    const componentDefiniton = `
<section class="card">
    <div>{{ value }}</div>
</section>
`
    const expected = `
<div>
    <section class="card">
        <div>local</div>
    </section>
</div>
`

    const result = await compile(input, {
        components: { Card: componentDefiniton },
        environment: { value: 'global' },
    })

    expect(result).toBe(expected)
})

test('it will fail if the value is not defined', async () => {
    const input = `
<div>
    <Card />
</div>
`
    const componentDefiniton = `
<section class="card">
    <div>{{ value }}</div>
</section>
`

    await expect(
        compile(input, {
            components: { Card: componentDefiniton },
            environment: {},
        }),
    ).rejects.toThrow(CompilationError)
})
