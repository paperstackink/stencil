import Tokenizer from '@/expressions/Tokenizer'
import Token from '@/expressions/Token'

import ParserError from '@/expressions/errors/ParserError'

test('it can tokenize "null"', () => {
    const input = `null`
    const expected = new Token('NULL', 'null', '', 0)
    const tokenizer = new Tokenizer(input)

    const result = tokenizer.scanTokens(input)[0]

    expect(result).toEqual(expected)
})

test('it can tokenize "true"', () => {
    const input = `true`
    const expected = new Token('TRUE', 'true', '', 0)
    const tokenizer = new Tokenizer(input)

    const result = tokenizer.scanTokens(input)[0]

    expect(result).toEqual(expected)
})

test('it can tokenize "false"', () => {
    const input = `false`
    const expected = new Token('FALSE', 'false', '', 0)
    const tokenizer = new Tokenizer(input)

    const result = tokenizer.scanTokens(input)[0]

    expect(result).toEqual(expected)
})

test('it can tokenize "if"', () => {
    const input = `if`
    const expected = new Token('IF', 'if', '', 0)
    const tokenizer = new Tokenizer(input)

    const result = tokenizer.scanTokens(input)[0]

    expect(result).toEqual(expected)
})

test('it can tokenize "then"', () => {
    const input = `then`
    const expected = new Token('THEN', 'then', '', 0)
    const tokenizer = new Tokenizer(input)

    const result = tokenizer.scanTokens(input)[0]

    expect(result).toEqual(expected)
})

test('it can tokenize "else"', () => {
    const input = `else`
    const expected = new Token('ELSE', 'else', '', 0)
    const tokenizer = new Tokenizer(input)

    const result = tokenizer.scanTokens(input)[0]

    expect(result).toEqual(expected)
})

test('it can tokenize "or"', () => {
    const input = `or`
    const expected = new Token('OR', 'or', '', 0)
    const tokenizer = new Tokenizer(input)

    const result = tokenizer.scanTokens(input)[0]

    expect(result).toEqual(expected)
})

test('it can tokenize "and"', () => {
    const input = `and`
    const expected = new Token('AND', 'and', '', 0)
    const tokenizer = new Tokenizer(input)

    const result = tokenizer.scanTokens(input)[0]

    expect(result).toEqual(expected)
})

test('it can tokenize "equals"', () => {
    const input = `equals`
    const expected = new Token('EQUALS', 'equals', '', 0)
    const tokenizer = new Tokenizer(input)

    const result = tokenizer.scanTokens(input)[0]

    expect(result).toEqual(expected)
})

test('it can tokenize "not equals"', () => {
    const input = `not equals`
    const expected = new Token('NOT_EQUALS', 'not equals', '', 0)
    const tokenizer = new Tokenizer(input)

    const result = tokenizer.scanTokens(input)[0]

    expect(result).toEqual(expected)
})

test('it can tokenize "less than"', () => {
    const input = `less than`
    const expected = new Token('LESS', 'less than', '', 0)
    const tokenizer = new Tokenizer(input)

    const result = tokenizer.scanTokens(input)[0]

    expect(result).toEqual(expected)
})

test('it can tokenize "less than or equals"', () => {
    const input = `less than or equals`
    const expected = new Token('LESS_EQUALS', 'less than or equals', '', 0)
    const tokenizer = new Tokenizer(input)

    const result = tokenizer.scanTokens(input)[0]

    expect(result).toEqual(expected)
})

test('it can tokenize "greater than"', () => {
    const input = `greater than`
    const expected = new Token('GREATER', 'greater than', '', 0)
    const tokenizer = new Tokenizer(input)

    const result = tokenizer.scanTokens(input)[0]

    expect(result).toEqual(expected)
})

test('it can tokenize "greater than or equals"', () => {
    const input = `greater than or equals`
    const expected = new Token(
        'GREATER_EQUALS',
        'greater than or equals',
        '',
        0,
    )
    const tokenizer = new Tokenizer(input)

    const result = tokenizer.scanTokens(input)[0]

    expect(result).toEqual(expected)
})

test('it ends with "EOF', () => {
    const input = `null`
    const expected = new Token('EOF', '', null, 4)
    const tokenizer = new Tokenizer(input)

    const result = tokenizer.scanTokens(input)[1]

    expect(result).toEqual(expected)
})

test('it can tokenize "("', () => {
    const input = `(`
    const expected = new Token('LEFT_PARENTHESIS', '(', '', 0)
    const tokenizer = new Tokenizer(input)

    const result = tokenizer.scanTokens(input)[0]

    expect(result).toEqual(expected)
})

test('it can tokenize ")"', () => {
    const input = `)`
    const expected = new Token('RIGHT_PARENTHESIS', ')', '', 0)
    const tokenizer = new Tokenizer(input)

    const result = tokenizer.scanTokens(input)[0]

    expect(result).toEqual(expected)
})

test('it can tokenize "."', () => {
    const input = `.`
    const expected = new Token('DOT', '.', '', 0)
    const tokenizer = new Tokenizer(input)

    const result = tokenizer.scanTokens(input)[0]

    expect(result).toEqual(expected)
})

test('it can tokenize "+"', () => {
    const input = `+`
    const expected = new Token('PLUS', '+', '', 0)
    const tokenizer = new Tokenizer(input)

    const result = tokenizer.scanTokens(input)[0]

    expect(result).toEqual(expected)
})

test('it can tokenize "-"', () => {
    const input = `-`
    const expected = new Token('MINUS', '-', '', 0)
    const tokenizer = new Tokenizer(input)

    const result = tokenizer.scanTokens(input)[0]

    expect(result).toEqual(expected)
})

test('it can tokenize "*"', () => {
    const input = `*`
    const expected = new Token('STAR', '*', '', 0)
    const tokenizer = new Tokenizer(input)

    const result = tokenizer.scanTokens(input)[0]

    expect(result).toEqual(expected)
})

test('it can tokenize "/"', () => {
    const input = `/`
    const expected = new Token('SLASH', '/', '', 0)
    const tokenizer = new Tokenizer(input)

    const result = tokenizer.scanTokens(input)[0]

    expect(result).toEqual(expected)
})

test('it can tokenize identifiers', () => {
    const input = `yo`
    const expected = new Token('IDENTIFIER', 'yo', '', 0)
    const tokenizer = new Tokenizer(input)

    const result = tokenizer.scanTokens(input)[0]

    expect(result).toEqual(expected)
})

test('it can tokenize identifiers starting with "$"', () => {
    const input = `$yo`
    const expected = new Token('IDENTIFIER', '$yo', '', 0)
    const tokenizer = new Tokenizer(input)

    const result = tokenizer.scanTokens(input)[0]

    expect(result).toEqual(expected)
})

test('it can tokenize double quoted strings', () => {
    const input = `"yo"`
    const expected = new Token('STRING', '"yo"', 'yo', 0)
    const tokenizer = new Tokenizer(input)

    const result = tokenizer.scanTokens(input)[0]

    expect(result).toEqual(expected)
})

test('it can tokenize single quoted strings', () => {
    const input = `'yo'`
    const expected = new Token('STRING', "'yo'", 'yo', 0)
    const tokenizer = new Tokenizer(input)

    const result = tokenizer.scanTokens(input)[0]

    expect(result).toEqual(expected)
})

test('it can tokenize integers', () => {
    const input = `2`
    const expected = new Token('NUMBER', '2', 2, 0)
    const tokenizer = new Tokenizer(input)

    const result = tokenizer.scanTokens(input)[0]

    expect(result).toEqual(expected)
})

test('it can tokenize floats', () => {
    const input = `2.3`
    const expected = new Token('NUMBER', '2.3', 2.3, 0)
    const tokenizer = new Tokenizer(input)

    const result = tokenizer.scanTokens(input)[0]

    expect(result).toEqual(expected)
})

test('a string must be terminated', () => {
    const input = `"yo`
    const tokenizer = new Tokenizer(input)

    const runner = () => tokenizer.scanTokens(input)

    expect(runner).toThrow(new ParserError('Unterminated string.'))
})

test('it fails un unknown characters', () => {
    const input = `^`
    const tokenizer = new Tokenizer(input)

    const runner = () => tokenizer.scanTokens(input)

    expect(runner).toThrow(new ParserError('Unexpected character.'))
})

test('it fails on an incomplete "less than" statement', () => {
    const input = `less`
    const tokenizer = new Tokenizer(input)

    const runner = () => tokenizer.scanTokens(input)

    expect(runner).toThrow(
        new ParserError("Unknown operator. Did you mean 'less than'?"),
    )
})

test('it fails on an incomplete "less than or equals" statement', () => {
    const input = `less than or`
    const tokenizer = new Tokenizer(input)

    const runner = () => tokenizer.scanTokens(input)

    expect(runner).toThrow(
        new ParserError(
            "Unknown operator. Did you mean 'less than or equals'?",
        ),
    )
})

test('it fails on an incomplete "greater than" statement', () => {
    const input = `greater`
    const tokenizer = new Tokenizer(input)

    const runner = () => tokenizer.scanTokens(input)

    expect(runner).toThrow(
        new ParserError("Unknown operator. Did you mean 'greater than'?"),
    )
})

test('it fails on an incomplete "greater than or equals" statement', () => {
    const input = `greater than or`
    const tokenizer = new Tokenizer(input)

    const runner = () => tokenizer.scanTokens(input)

    expect(runner).toThrow(
        new ParserError(
            "Unknown operator. Did you mean 'greater than or equals'?",
        ),
    )
})

test('keywords are case sensitive', () => {
    const input = `TRUE`
    const tokenizer = new Tokenizer(input)

    const runner = () => tokenizer.scanTokens(input)

    expect(runner).toThrow(
        new ParserError("Keywords are case sensitive. Try 'true' instead."),
    )
})

test('it can tokenize multiple things', () => {
    const input = `true`
    const expected = new Token('EOF', '', null, 4)
    const tokenizer = new Tokenizer(input)

    const result = tokenizer.scanTokens(input)[1]

    expect(result).toEqual(expected)
})

test('it can tokenize multiple things', () => {
    const input = `true equals false`
    const expected = [
        new Token('TRUE', 'true', '', 0),
        new Token('EQUALS', 'equals', '', 5),
        new Token('FALSE', 'false', '', 12),
        new Token('EOF', '', null, 17),
    ]
    const tokenizer = new Tokenizer(input)

    const result = tokenizer.scanTokens(input)

    expect(result).toEqual(expected)
})
