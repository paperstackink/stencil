import isWhitespace from '@/helpers/isWhitespace'

test('it recognizes a string with only spaces', () => {
    const input = `    `
    const result = isWhitespace(input)

    expect(result).toBe(true)
})

test('it recognizes a line break', () => {
    const input = `\n`
    const result = isWhitespace(input)

    expect(result).toBe(true)
})

test('it recognizes both whitespace types at the same time', () => {
    const input = `\n    `
    const result = isWhitespace(input)

    expect(result).toBe(true)
})

test('it recognizes non-whitespace characters', () => {
    const input = `\n    x`
    const result = isWhitespace(input)

    expect(result).toBe(false)
})
