import Token from '@/expressions/Token'
import Parser from '@/expressions/Parser'
import Tokenizer from '@/expressions/Tokenizer'
import Expression from '@/expressions/Expression'
import Interpreter from '@/expressions/Interpreter'
import InternalError from '@/expressions/errors/InternalError'

const evaluate = (input, scope) => {
    const tokenizer = new Tokenizer(input)
    const tokens = tokenizer.scanTokens()
    const parser = new Parser(tokens)
    const ast = parser.parse()
    const interpreter = new Interpreter(ast, scope)
    const output = interpreter.interpret()

    return output
}

describe('Literals', () => {
    test('it can evaluate booleans', () => {
        const input = `false`
        const expected = false
        const output = evaluate(input)

        expect(output).toEqual(expected)
    })

    test('it can evaluate "null"', () => {
        const input = `null`
        const expected = ''
        const output = evaluate(input)

        expect(output).toEqual(expected)
    })

    test('it can evaluate numbers', () => {
        const input = `1.2`
        const expected = 1.2
        const output = evaluate(input)

        expect(output).toEqual(expected)
    })

    test('it can evaluate strings', () => {
        const input = `"yo"`
        const expected = 'yo'
        const output = evaluate(input)

        expect(output).toEqual(expected)
    })
})

describe('Variables', () => {
    test('it can evaluate variable names', () => {
        const input = `name`
        const expected = 'value'
        const output = evaluate(input, {
            name: 'value',
        })

        expect(output).toEqual(expected)
    })

    test('undefined identifiers become "null"', () => {
        const input = `name`
        const expected = ''

        const output = evaluate(input, {})

        expect(output).toEqual(expected)
    })
})

describe('Groups', () => {
    test('it can evaluate a group', () => {
        const input = `(2)`
        const expected = 2
        const output = evaluate(input)

        expect(output).toEqual(expected)
    })
})

describe('Conditional Expressions', () => {
    test('it can evaluate a true conditional', () => {
        const input = `if true then 2 else 3`
        const expected = 2
        const output = evaluate(input)

        expect(output).toEqual(expected)
    })
    test('it can evaluate a false conditional', () => {
        const input = `if false then 2 else 3`
        const expected = 3
        const output = evaluate(input)

        expect(output).toEqual(expected)
    })
})

describe('Logical Expressions', () => {
    test('it can evaluate an "or" expression', () => {
        const input = `true or false`
        const expected = true
        const output = evaluate(input)

        expect(output).toEqual(expected)
    })
    test('it can evaluate an "and" expression', () => {
        const input = `true and false`
        const expected = false
        const output = evaluate(input)

        expect(output).toEqual(expected)
    })
})

describe('Binary Expressions', () => {
    test('it can evaluate an equality expression', () => {
        const input = `2 equals 2`
        const expected = true
        const output = evaluate(input)

        expect(output).toEqual(expected)
    })

    test('it can evaluate a comparison expression', () => {
        const input = `2 less than 1`
        const expected = false
        const output = evaluate(input)

        expect(output).toEqual(expected)
    })

    test('it can evaluate a terminus expression', () => {
        const input = `2 + 1`
        const expected = 3
        const output = evaluate(input)

        expect(output).toEqual(expected)
    })

    test('it can evaluate a factor expression', () => {
        const input = `2 * 3`
        const expected = 6
        const output = evaluate(input)

        expect(output).toEqual(expected)
    })
})

describe('Unary Expressions', () => {
    test('it can evaluate a unary expression', () => {
        const input = `not true`
        const expected = false
        const output = evaluate(input)

        expect(output).toEqual(expected)
    })
})

describe('Errors', () => {
    // TODO
})

describe('Type checking', () => {
    // TODO
})

describe('Truthiness', () => {
    // TODO
})
