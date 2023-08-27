import { compile } from '@/index'

test('it renders the children if the condition is truthy', async () => {
    const input = `
<div>
    @if(true)
        <span>Content</span>
    @endif
</div>
`
    const expected = `
<div>
    <span>Content</span>
</div>
`
    const result = await compile(input)

    expect(result).toEqualIgnoringWhitespace(expected)
})

test('it renders nothing if the condition is false', async () => {
    const input = `
<div>
    @if(false)
        <span>Content</span>
    @endif
</div>
`
    const expected = `
<div></div>
`
    const result = await compile(input)

    expect(result).toEqualIgnoringWhitespace(expected)
})

test('it evaluates the expression', async () => {
    const input = `
<div>
    @if(1 + 2 equals 3)
        <span>Content</span>
    @endif
</div>
`
    const expected = `
<div>
    <span>Content</span>
</div>
`
    const result = await compile(input)

    expect(result).toEqualIgnoringWhitespace(expected)
})

test('it compiles nodes inside the @if directive', async () => {
    const input = `
<div>
    @if(true)
        <span>{{ text }}</span>
    @endif
</div>
`
    const expected = `
<div>
    <span>Content</span>
</div>
`
    const result = await compile(input, {
        environment: {
            global: {
                text: 'Content',
            },
        },
    })

    expect(result).toEqualIgnoringWhitespace(expected)
})

test('it can compile nested if directives', async () => {
    const input = `
<div>
    @if(true)
        @if(true)
            <span>Content</span>
        @endif
    @endif
</div>
`
    const expected = `
<div>
    <span>Content</span>
</div>
`
    const result = await compile(input)

    expect(result).toEqualIgnoringWhitespace(expected)
})

test('it can compile a directive with a quoted string', async () => {
    const input = `
<div>
    @if(value equals "Yo")
        <span>Content</span>
    @endif
</div>
`
    const expected = `
<div>
    <span>Content</span>
</div>
`
    const result = await compile(input, {
        environment: {
            global: { value: 'Yo' },
        },
    })

    expect(result).toEqualIgnoringWhitespace(expected)
})
