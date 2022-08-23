import { compile } from '@/index'
import CompilationError from '@/errors/CompilationError'

test('it can output values in text elements', async () => {
    const input = `<span>{{ value }}</span>`
    const expected = `<span>Outputted text</span>`

    const result = await compile(input, {
        environment: { value: 'Outputted text' },
    })

    expect(result).toBe(expected)
})

test('it can output values in attributes', async () => {
    const input = `<span id="{{ id }}">Text</span>`
    const expected = `<span id="headline">Text</span>`

    const result = await compile(input, {
        environment: { id: 'headline' },
    })

    expect(result).toBe(expected)
})

test('it can output multiple values in the same attribute', async () => {
    const input = `<span class="{{ color }} {{ size }}">Text</span>`
    const expected = `<span class="red large">Text</span>`

    const result = await compile(input, {
        environment: { color: 'red', size: 'large' },
    })

    expect(result).toBe(expected)
})

test('it can output multiple values in different attributes', async () => {
    const input = `<span class="{{ class }}" id="{{ id }}">Text</span>`
    const expected = `<span class="text-red" id="text-element">Text</span>`

    const result = await compile(input, {
        environment: { className: 'text-red', id: 'text-element' },
    })

    expect(result).toBe(expected)
})

test('it can output the same value multiple times', async () => {
    const input = `<span class="{{ name }}" id="{{ name }}">Text</span>`
    const expected = `<span class="title" id="title">Text</span>`

    const result = await compile(input, {
        environment: { name: 'title' },
    })

    expect(result).toBe(expected)
})

test('it can output values concatenated to an existing string', async () => {
    const input = `<span class="text-{{ size }}">Text</span>`
    const expected = `<span class="text-large">Text</span>`

    const result = await compile(input, {
        environment: { size: 'large' },
    })

    expect(result).toBe(expected)
})

test('it fails if the value has not been defined', async () => {
    const input = `<span class="{{ class }}">Text</span>`

    await expect(
        compile(input, {
            environment: {},
        }),
    ).rejects.toThrow(CompilationError)
})

test('it fails if the output expression is empty', async () => {
    const input = `<span class="{{  }}">Text</span>`

    await expect(
        compile(input, {
            environment: {},
        }),
    ).rejects.toThrow(CompilationError)
})

test('it fails if there are nested output expressions', async () => {
    const input = `<span class="{{ {{ value }} }}">Text</span>`

    await expect(
        compile(input, {
            environment: { class: 'text' },
        }),
    ).rejects.toThrow(CompilationError)
})

test('it ignores regular string attributes', async () => {
    const input = `<span class="text">Text</span>`
    const expected = `<span class="text">Text</span>`

    const result = await compile(input, {
        environment: {},
    })

    expect(result).toBe(expected)
})

test('it ignores regular boolean attributes', async () => {
    const input = `<input disabled="true" />`
    const expected = `<input disabled />`

    const result = await compile(input, {
        environment: {},
    })

    expect(result).toBe(expected)
})

test('it ignores regular number attributes', async () => {
    const input = `<input maxlength="4" />`
    const expected = `<input maxlength="4" />`

    const result = await compile(input, {
        environment: {},
    })

    expect(result).toBe(expected)
})

test('it ignores attributes with an empty value', async () => {
    const input = `<input disabled="" />`
    const expected = `<input disabled />`

    const result = await compile(input, {
        environment: {},
    })

    expect(result).toBe(expected)
})

test('it ignores attributes with no value', async () => {
    const input = `<input disabled />`
    const expected = `<input disabled />`

    const result = await compile(input, {
        environment: {},
    })

    expect(result).toBe(expected)
})

test('it replaces multiple instances of a value being outputted in the same element', async () => {
    const input = `<span>{{ value }} and {{ value }}</span>`
    const expected = `<span>Yo and Yo</span>`

    const result = await compile(input, {
        environment: { value: 'Yo' },
    })

    expect(result).toBe(expected)
})

test('it outputs an html string as html', async () => {
    const input = `<div>Text. {{ content }} Text</div>`
    const expected = `
<div>Text.
    <p>HTML</p>
    <p>More HTML</p>Text
</div>
`

    const result = await compile(input, {
        environment: { content: '<p>HTML</p><p>More HTML</p>' },
    })

    expect(result).toBe(expected)
})

test('it can inject both a regular string and html', async () => {
    const input = `<div>{{ title }}{{ content }}{{title}}</div>`
    const expected = `
<div>Title
    <p>HTML</p>Title
</div>
`

    const result = await compile(input, {
        environment: {
            title: 'Title',
            content: '<p>HTML</p>',
        },
    })

    expect(result).toBe(expected)
})
