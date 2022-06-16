import { compile } from '@/index'

test('an attribute can be outputted inside a component', async () => {
    const input = `
<div>
    <Card text="Yo" />
</div>
`
    const componentDefiniton = `
<section class="card">
    <div>{{text}}</div>
</section>
`
    const expected = `
<div>
    <section class="card">
        <div>Yo</div>
    </section>
</div>
`

    const result = await compile(input, {
        components: { Card: componentDefiniton },
        environment: {},
    })

    expect(result).toBe(expected)
})

test('it adds an attribute to the root element if it is not outputted', async () => {
    const input = `
<div>
    <Card class="card" />
</div>
`
    const componentDefiniton = `
<section>
    <div>Yo</div>
</section>
`
    const expected = `
<div>
    <section class="card">
        <div>Yo</div>
    </section>
</div>
`

    const result = await compile(input, {
        components: { Card: componentDefiniton },
        environment: {},
    })

    expect(result).toBe(expected)
})

test('it does not add the attribute to the root element if it is outputted', async () => {
    const input = `
<div>
    <Card class="card" text="Yo" />
</div>
`
    const componentDefiniton = `
<section>
    <div>{{ text }}</div>
</section>
`
    const expected = `
<div>
    <section class="card">
        <div>Yo</div>
    </section>
</div>
`

    const result = await compile(input, {
        components: { Card: componentDefiniton },
        environment: {},
    })

    expect(result).toBe(expected)
})

test('it preserves default attributes on the root element', async () => {
    const input = `
<div>
    <Card class="card" />
</div>
`
    const componentDefiniton = `
<section id="card">
    <div>Yo</div>
</section>
`
    const expected = `
<div>
    <section id="card" class="card">
        <div>Yo</div>
    </section>
</div>
`

    const result = await compile(input, {
        components: { Card: componentDefiniton },
        environment: {},
    })

    expect(result).toBe(expected)
})

test('it can override default attributes on the root element', async () => {
    const input = `
<div>
    <Card id="new-id" />
</div>
`
    const componentDefiniton = `
<section id="default-id">
    <div>Yo</div>
</section>
`
    const expected = `
<div>
    <section id="new-id">
        <div>Yo</div>
    </section>
</div>
`

    const result = await compile(input, {
        components: { Card: componentDefiniton },
        environment: {},
    })

    expect(result).toBe(expected)
})

test('a user can manually merge attributes on the root element', async () => {
    const input = `
<div>
    <Card class="large" />
</div>
`
    const componentDefiniton = `
<section class="white {{ class }}">
    <div>Yo</div>
</section>
`
    const expected = `
<div>
    <section class="white large">
        <div>Yo</div>
    </section>
</div>
`

    const result = await compile(input, {
        components: { Card: componentDefiniton },
        environment: {},
    })

    expect(result).toBe(expected)
})

test('it can detect whether "class" was used as output', async () => {
    const input = `
<div>
    <Card class="card" />
</div>
`
    const componentDefiniton = `
<section>
    <div>{{ class }}</div>
</section>
`
    const expected = `
<div>
    <section>
        <div>card</div>
    </section>
</div>
`

    const result = await compile(input, {
        components: { Card: componentDefiniton },
        environment: {},
    })

    expect(result).toBe(expected)
})

test('it preserves the attribute on the root element if the attribute is used elsewhere', async () => {
    const input = `
<div>
    <Card id="card" />
</div>
`
    const componentDefiniton = `
<section id="pre-defined-id">
    <div>{{ id }}</div>
</section>
`
    const expected = `
<div>
    <section id="pre-defined-id">
        <div>card</div>
    </section>
</div>
`

    const result = await compile(input, {
        components: { Card: componentDefiniton },
        environment: {},
    })

    expect(result).toBe(expected)
})
