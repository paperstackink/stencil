import { compile } from '@/index'
import CompilationError from '@/errors/CompilationError'

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

    expect(result).toEqualIgnoringWhitespace(expected)
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

    expect(result).toEqualIgnoringWhitespace(expected)
})

test('it fails if the component is not defined', async () => {
    const input = `
<div>
    <Card />
</div>
`

    await expect(
        compile(input, {
            components: {},
        }),
    ).rejects.toThrow(CompilationError)
})

test('it does not compile an html element with the same name as a component', async () => {
    const input = `
<div>
    <button>Yo</button>
</div>
`
    const componentDefiniton = `
<button>
    Click me
</button>
`
    const expected = `
<div><button>Yo</button></div>
`

    const result = await compile(input, {
        components: { button: componentDefiniton },
    })

    expect(result).toEqualIgnoringWhitespace(expected)
})

test('it does not compile a component with a lowercase name', async () => {
    const input = `
<div>
    <card>Yo</card>
</div>
`
    const componentDefiniton = `
<section class="class">
    <div>This is a card</div>
</section>
`
    const expected = `
<div>
    <card>Yo</card>
</div>
`

    const result = await compile(input, {
        components: { card: componentDefiniton },
    })

    expect(result).toEqualIgnoringWhitespace(expected)
})

test('it can compile a nested component', async () => {
    const input = `
<div>
    <Card />
</div>
`
    const rootComponentDefiniton = `
<section class="card">
    <Nested />
</section>
`

    const nestedComponentDefinition = `
<div>
    This is nested
</div>
`

    const expected = `
<div>
    <section class="card">
        <div>This is nested</div>
    </section>
</div>
`

    const result = await compile(input, {
        components: {
            Card: rootComponentDefiniton,
            Nested: nestedComponentDefinition,
        },
    })

    expect(result).toEqualIgnoringWhitespace(expected)
})

test('it fails if there are more than 1 root element in a component definition', async () => {
    const input = `
<div>
    <Card />
</div>
`
    const componentDefiniton = `
<div>Section 1</div>
<div>Section 2</div>
`

    await expect(
        compile(input, {
            components: {
                Card: componentDefiniton,
            },
        }),
    ).rejects.toThrow(CompilationError)
})

test('it can inject a full html document', async () => {
    const input = `<Document />`
    const componentDefiniton = `
<html>
    <head>
        <title>Document</title>
    </head>
    <body></body>
</html>
`
    const expected = `
<html>
    <head>
        <title>Document</title>
    </head>
    <body></body>
</html>
`

    const result = await compile(input, {
        components: { Document: componentDefiniton },
    })

    expect(result).toEqualIgnoringWhitespace(expected)
})
