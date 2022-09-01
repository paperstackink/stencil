import replaceExpressionWithValue from '@/helpers/replaceExpressionWithValue'
import CompilationError from '@/errors/CompilationError'

test('it can replace an expression with no whitespace', () => {
    const input = `This is a {{type}}`
    const expected = `This is a string`

    const result = replaceExpressionWithValue(input, {
        type: 'string',
    })

    expect(result).toBe(expected)
})

test('it can replace an expression with spaces', () => {
    const input = `This is a {{ type }}`
    const expected = `This is a string`

    const result = replaceExpressionWithValue(input, {
        type: 'string',
    })

    expect(result).toBe(expected)
})

test('it can replace an expression with a lot of whitespace', () => {
    const input = `This is a {{      type   }}`
    const expected = `This is a string`

    const result = replaceExpressionWithValue(input, {
        type: 'string',
    })

    expect(result).toBe(expected)
})

test('it can output a value multiple times', () => {
    const input = `This is a {{ type }} of type {{ type }}`
    const expected = `This is a string of type string`

    const result = replaceExpressionWithValue(input, {
        type: 'string',
    })

    expect(result).toBe(expected)
})

test('it fails if the value has not been defined', () => {
    const input = `This is a {{ type }}`

    expect(() => replaceExpressionWithValue(input, {})).toThrow(
        CompilationError,
    )
})

test('it fails if the output expression is empty', () => {
    const input = `This is a {{ }}`

    expect(() => replaceExpressionWithValue(input, {})).toThrow(
        CompilationError,
    )
})

test.skip('it fails if there are nested output expressions', () => {
    const input = `This is a {{ {{ type }} }}`

    expect(() =>
        replaceExpressionWithValue(input, {
            type: 'string',
        }),
    ).toThrow(CompilationError)
})
