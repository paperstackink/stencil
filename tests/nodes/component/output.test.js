import { compile } from '@/index'
import CompilationError from '@/errors/CompilationError'

test('it can compile a global identifier expression', async () => {
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

test('it can compile a local identifier expression', async () => {
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

test('it can compile an expression in a text child node', async () => {
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

test('it can compile an expression in an attribute', async () => {
    const input = `
<div>
    <Card />
</div>
`
    const componentDefiniton = `
<section id="{{ id }}">
    <div>This is a card</div>
</section>
`
    const expected = `
<div>
    <section id="card">
        <div>This is a card</div>
    </section>
</div>
`

    const result = await compile(input, {
        components: { Card: componentDefiniton },
        environment: { id: 'card' },
    })

    expect(result).toBe(expected)
})

test('it can compile an expression in the default slot', async () => {
    const input = `
<div>
    <Card default="Yo" />
</div>
`
    const componentDefiniton = `
<section>
    <slot>
        <p>{{ default }}</p>
    </slot>
</section>
`
    const expected = `
<div>
    <section>
        <p>Yo</p>
    </section>
</div>
`

    const result = await compile(input, {
        components: { Card: componentDefiniton },
        environment: {},
    })

    expect(result).toBe(expected)
})

test('it can compile an expression in a passed slot', async () => {
    const input = `
<div>
    <Card>
        <p>{{ value }}</p>
    </Card>
</div>
`
    const componentDefiniton = `
<section>
    <slot />
</section>
`
    const expected = `
<div>
    <section>
        <p>Yo</p>
    </section>
</div>
`

    const result = await compile(input, {
        components: { Card: componentDefiniton },
        environment: { value: 'Yo' },
    })

    expect(result).toBe(expected)
})

test('a global identifier can be overriden by a local identifier', async () => {
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

test('it will fail if the identifier is not defined', async () => {
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

test('a multi word attribute is camelcased', async () => {
    const input = `
<div>
    <Card autocorrect="true" />
</div>
`
    const componentDefiniton = `
<section class="card">
    <div autocorrect="{{ autoCorrect }}">Text</div>
</section>
`
    const expected = `
<div>
    <section class="card">
        <div autocorrect="true">Text</div>
    </section>
</div>
`

    const result = await compile(input, {
        components: { Card: componentDefiniton },
        environment: {},
    })

    expect(result).toBe(expected)
})

test('it camelCases attribute names with dashes', async () => {
    const input = `
<div>
    <Card data-some-attribute="Output" />
</div>
`
    const componentDefiniton = `
<section class="card">
    <div>{{ dataSomeAttribute }}</div>
</section>
`
    const expected = `
<div>
    <section class="card">
        <div>Output</div>
    </section>
</div>
`

    const result = await compile(input, {
        components: { Card: componentDefiniton },
        environment: {},
    })

    expect(result).toBe(expected)
})

test('it can print a class attribute', async () => {
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
        environment: { className: 'card' },
    })

    expect(result).toBe(expected)
})

test('it can print a class attribute with multiple values', async () => {
    const input = `
<div>
    <Card class="sm:small lg:large" />
</div>
`
    const componentDefiniton = `
<section class="elevated {{ class }}">
    <div>This is a card</div>
</section>
`
    const expected = `
<div>
    <section class="elevated sm:small lg:large">
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
