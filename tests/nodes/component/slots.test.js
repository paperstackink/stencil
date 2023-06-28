import { compile } from '@/index'

describe('Default slots', () => {
    test('it can replace the default slot', async () => {
        const input = `
<div>
    <Card><p>Yo</p></Card>
</div>
`
        const componentDefiniton = `
<section class="card">
    <slot />
</section>
`
        const expected = `
<div>
    <section class="card">
        <p>Yo</p>
    </section>
</div>
`

        const result = await compile(input, {
            components: { Card: componentDefiniton },
        })

        expect(result).toBe(expected)
    })

    test('multiple children can be slot content', async () => {
        const input = `
<div>
    <Card>
        <p>Child 1</p>
        <p>Child 2</p>
    </Card>
</div>
`
        const componentDefiniton = `
<section class="card">
    <slot />
</section>
`
        const expected = `
<div>
    <section class="card">
        <p>Child 1</p>
        <p>Child 2</p>
    </section>
</div>
`

        const result = await compile(input, {
            components: { Card: componentDefiniton },
        })

        expect(result).toBe(expected)
    })

    test('it replaces the default slot with an empty string if not content is passed into the slot', async () => {
        const input = `
<div>
    <Card></Card>
</div>
`
        const componentDefiniton = `
<section class="card">
    <slot />
</section>
`
        const expected = `
<div>
    <section class="card"></section>
</div>
`

        const result = await compile(input, {
            components: { Card: componentDefiniton },
        })

        expect(result).toBe(expected)
    })

    test.todo('it warns if content is provided if there is no slot')
})

describe('Default content', () => {
    test('a slot can have default content', async () => {
        const input = `
<div>
    <Card></Card>
</div>
`
        const componentDefiniton = `
<section class="card">
    <slot>
        <p>Default</p>
    </slot>
</section>
`
        const expected = `
<div>
    <section class="card">
        <p>Default</p>
    </section>
</div>
`

        const result = await compile(input, {
            components: { Card: componentDefiniton },
        })

        expect(result).toBe(expected)
    })

    test('a slot can have multiple children as default content', async () => {
        const input = `
<div>
    <Card></Card>
</div>
`
        const componentDefiniton = `
<section class="card">
    <slot>
        <p>Default 1</p>
        <p>Default 2</p>
    </slot>
</section>
`
        const expected = `
<div>
    <section class="card">
        <p>Default 1</p>
        <p>Default 2</p>
    </section>
</div>
`

        const result = await compile(input, {
            components: { Card: componentDefiniton },
        })

        expect(result).toBe(expected)
    })

    test('default content is overriden by provided content', async () => {
        const input = `
<div>
    <Card>
        <p>Override</p>
    </Card>
</div>
`
        const componentDefiniton = `
<section class="card">
    <slot>
        <p>Default</p>
    </slot>
</section>
`
        const expected = `
<div>
    <section class="card">
        <p>Override</p>
    </section>
</div>
`

        const result = await compile(input, {
            components: { Card: componentDefiniton },
        })

        expect(result).toBe(expected)
    })
})

describe('Named slots', () => {})

describe('Scoped slots', () => {})
