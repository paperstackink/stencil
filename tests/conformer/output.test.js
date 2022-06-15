import conform from '@/helpers/conformer'

test('it removes whitespaces in an output expression', () => {
    const input = `<span class="{{ class }}">Text</span>`
    const expected = `<span class="{{class}}">Text</span>`

    const result = conform(input)

    expect(result).toBe(expected)
})

test('it removes whitespace in multiple output expressions', () => {
    const input = `<span class="{{ class }}" id="{{ id }}">Text</span>`
    const expected = `<span class="{{class}}" id="{{id}}">Text</span>`

    const result = conform(input)

    expect(result).toBe(expected)
})

test('it removes whitespace in empty output expressions', () => {
    const input = `<span class="{{ }}">Text</span>`
    const expected = `<span class="{{}}">Text</span>`

    const result = conform(input)

    expect(result).toBe(expected)
})
