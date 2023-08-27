import { compile } from '@/index'
import CompilationError from '@/errors/CompilationError'

test('it renders each item in the loop', async () => {
    const input = `
<div>
    @each(item in $record)
        <span>{{ item.value }}</span>
    @endeach
</div>
`
    const expected = `
<div>
    <span>Item 1</span>
    <span>Item 2</span>
    <span>Item 3</span>
</div>
`
    const result = await compile(input, {
        environment: {
            global: {
                $record: new Map([
                    ['item1', new Map([['value', 'Item 1']])],
                    ['item2', new Map([['value', 'Item 2']])],
                    ['item3', new Map([['value', 'Item 3']])],
                ]),
            },
        },
    })

    expect(result).toEqualIgnoringWhitespace(expected)
})

test('it can compile with multiple child root nodes', async () => {
    const input = `
<div>
    @each(item in $record)
        <span>{{ item.value }}</span>
        <hr />
    @endeach
</div>
`
    const expected = `
<div>
    <span>Item 1</span>
    <hr />
    <span>Item 2</span>
    <hr />
    <span>Item 3</span>
    <hr />
</div>
`
    const result = await compile(input, {
        environment: {
            global: {
                $record: new Map([
                    ['item1', new Map([['value', 'Item 1']])],
                    ['item2', new Map([['value', 'Item 2']])],
                    ['item3', new Map([['value', 'Item 3']])],
                ]),
            },
        },
    })

    expect(result).toEqualIgnoringWhitespace(expected)
})

test('it can print the key', async () => {
    const input = `
<div>
    @each(item, key in $record)
        <span>{{ key }}</span>
    @endeach
</div>
`
    const expected = `
<div>
    <span>item1</span>
    <span>item2</span>
    <span>item3</span>
</div>
`
    const result = await compile(input, {
        environment: {
            global: {
                $record: new Map([
                    ['item1', new Map([['value', 'Item 1']])],
                    ['item2', new Map([['value', 'Item 2']])],
                    ['item3', new Map([['value', 'Item 3']])],
                ]),
            },
        },
    })

    expect(result).toEqualIgnoringWhitespace(expected)
})

test('it compiles the record expression', async () => {
    const input = `
<div>
    @each(item, key in $record.nested)
        <span>{{ key }}</span>
    @endeach
</div>
`
    const expected = `
<div>
    <span>item1</span>
    <span>item2</span>
    <span>item3</span>
</div>
`
    const result = await compile(input, {
        environment: {
            global: {
                $record: new Map([
                    [
                        'nested',
                        new Map([
                            ['item1', new Map([['value', 'Item 1']])],
                            ['item2', new Map([['value', 'Item 2']])],
                            ['item3', new Map([['value', 'Item 3']])],
                        ]),
                    ],
                ]),
            },
        },
    })

    expect(result).toEqualIgnoringWhitespace(expected)
})

test('it compiles the loop html', async () => {
    const input = `
<div>
    @each(item in $record)
        <Link href="{{ item.url }}">{{ item.label }}</Link>
    @endeach
</div>
`
    const expected = `
<div>
    <a href="http://example.com/item1">Item 1</a>
    <a href="http://example.com/item2">Item 2</a>
    <a href="http://example.com/item3">Item 3</a>
</div>
`
    const definition = `<a href="{{ url }}"><slot /></a>`

    const result = await compile(input, {
        components: {
            Link: definition,
        },
        environment: {
            global: {
                $record: new Map([
                    [
                        'item1',
                        new Map([
                            ['url', 'http://example.com/item1'],
                            ['label', 'Item 1'],
                        ]),
                    ],
                    [
                        'item2',
                        new Map([
                            ['url', 'http://example.com/item2'],
                            ['label', 'Item 2'],
                        ]),
                    ],
                    [
                        'item3',
                        new Map([
                            ['url', 'http://example.com/item3'],
                            ['label', 'Item 3'],
                        ]),
                    ],
                ]),
            },
        },
    })

    expect(result).toEqualIgnoringWhitespace(expected)
})

test('it can render nested loops', async () => {
    const input = `
<div>
    @each(item in $record)
        @each(nested in item)
            <span>{{ nested.value }}</span>
        @endeach
    @endeach
</div>
`
    const expected = `
<div>
    <span>Item 1a</span>
    <span>Item 1b</span>
    <span>Item 2a</span>
    <span>Item 2b</span>
    <span>Item 3a</span>
    <span>Item 3b</span>
</div>
`

    const result = await compile(input, {
        environment: {
            global: {
                $record: new Map([
                    [
                        'item1',
                        new Map([
                            ['1', new Map([['value', 'Item 1a']])],
                            ['2', new Map([['value', 'Item 1b']])],
                        ]),
                    ],
                    [
                        'item2',
                        new Map([
                            ['1', new Map([['value', 'Item 2a']])],
                            ['2', new Map([['value', 'Item 2b']])],
                        ]),
                    ],
                    [
                        'item3',
                        new Map([
                            ['1', new Map([['value', 'Item 3a']])],
                            ['2', new Map([['value', 'Item 3b']])],
                        ]),
                    ],
                ]),
            },
        },
    })

    expect(result).toEqualIgnoringWhitespace(expected)
})

test('it can conditionally render items', async () => {
    const input = `
<div>
    @each(item in $record)
        @if(item.value greater than 1)
            <span>Item {{ item.value }}</span>
        @endif
    @endeach
</div>
`
    const expected = `
<div>
    <span>Item 2</span>
    <span>Item 3</span>
</div>
`
    const result = await compile(input, {
        environment: {
            global: {
                $record: new Map([
                    ['item1', new Map([['value', 1]])],
                    ['item2', new Map([['value', 2]])],
                    ['item3', new Map([['value', 3]])],
                ]),
            },
        },
    })

    expect(result).toEqualIgnoringWhitespace(expected)
})

test('it can use variables from the outer scope', async () => {
    const input = `
<div>
    @each(item in $record)
        <span>{{ item.value }} - {{ global }}</span>
    @endeach
</div>
`
    const expected = `
<div>
    <span>Item 1 - Global</span>
    <span>Item 2 - Global</span>
    <span>Item 3 - Global</span>
</div>
`
    const result = await compile(input, {
        environment: {
            global: {
                global: 'Global',
                $record: new Map([
                    ['item1', new Map([['value', 'Item 1']])],
                    ['item2', new Map([['value', 'Item 2']])],
                    ['item3', new Map([['value', 'Item 3']])],
                ]),
            },
        },
    })

    expect(result).toEqualIgnoringWhitespace(expected)
})

test('the variable overrides a variable with the same name in an outer scope', async () => {
    const input = `
<div>
    @each(item in $record)
        <span>{{ item.value }}</span>
    @endeach
</div>
`
    const expected = `
<div>
    <span>Item 1</span>
    <span>Item 2</span>
    <span>Item 3</span>
</div>
`
    const result = await compile(input, {
        environment: {
            global: {
                item: new Map([['value', 'Noop']]),
                $record: new Map([
                    ['item1', new Map([['value', 'Item 1']])],
                    ['item2', new Map([['value', 'Item 2']])],
                    ['item3', new Map([['value', 'Item 3']])],
                ]),
            },
        },
    })

    expect(result).toEqualIgnoringWhitespace(expected)
})

test('the variable overrides a variable with the same name in an outer loop', async () => {
    const input = `
<div>
    @each(item in $record)
        @each(nested in item)
            <span>{{ nested.value }}</span>
        @endeach
    @endeach
</div>
`
    const expected = `
<div>
    <span>Item 1a</span>
    <span>Item 1b</span>
    <span>Item 2a</span>
    <span>Item 2b</span>
    <span>Item 3a</span>
    <span>Item 3b</span>
</div>
`

    const result = await compile(input, {
        environment: {
            global: {
                nested: 'Noop',
                $record: new Map([
                    [
                        'item1',
                        new Map([
                            ['1', new Map([['value', 'Item 1a']])],
                            ['2', new Map([['value', 'Item 1b']])],
                        ]),
                    ],
                    [
                        'item2',
                        new Map([
                            ['1', new Map([['value', 'Item 2a']])],
                            ['2', new Map([['value', 'Item 2b']])],
                        ]),
                    ],
                    [
                        'item3',
                        new Map([
                            ['1', new Map([['value', 'Item 3a']])],
                            ['2', new Map([['value', 'Item 3b']])],
                        ]),
                    ],
                ]),
            },
        },
    })

    expect(result).toEqualIgnoringWhitespace(expected)
})

test("it fails if looping over something that's not a record", async () => {
    const input = `
<div>
    @each(item in $record)
        <span>{{ item.value }}</span>
    @endeach
</div>
`
    const expected = `
<div>
    <span>Item 1</span>
    <span>Item 2</span>
    <span>Item 3</span>
</div>
`

    await expect(
        compile(input, {
            environment: {
                global: {
                    $record: 'a string',
                },
            },
        }),
    ).rejects.toThrow(CompilationError)
})
