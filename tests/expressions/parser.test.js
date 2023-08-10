import Token from '@/expressions/Token'
import Parser from '@/expressions/Parser'
import Tokenizer from '@/expressions/Tokenizer'
import Expression from '@/expressions/Expression'
import ParserError from '@/expressions/errors/ParserError'

describe('Literals', () => {
    test('it can parse "false"', () => {
        const input = `false`
        const expected = new Expression.Literal(false)
        const tokenizer = new Tokenizer(input)
        const tokens = tokenizer.scanTokens()
        const parser = new Parser(tokens)
        const ast = parser.parse()

        expect(ast).toEqual(expected)
    })

    test('it can parse "true"', () => {
        const input = `true`
        const expected = new Expression.Literal(true)
        const tokenizer = new Tokenizer(input)
        const tokens = tokenizer.scanTokens()
        const parser = new Parser(tokens)
        const ast = parser.parse()

        expect(ast).toEqual(expected)
    })

    test('it can parse "null"', () => {
        const input = `null`
        const expected = new Expression.Literal(null)
        const tokenizer = new Tokenizer(input)
        const tokens = tokenizer.scanTokens()
        const parser = new Parser(tokens)
        const ast = parser.parse()

        expect(ast).toEqual(expected)
    })

    test('it can parse a number', () => {
        const input = `10`
        const expected = new Expression.Literal(10)
        const tokenizer = new Tokenizer(input)
        const tokens = tokenizer.scanTokens()
        const parser = new Parser(tokens)
        const ast = parser.parse()

        expect(ast).toEqual(expected)
    })
})

describe('Variables', () => {
    test('it can parse an identifier', () => {
        const input = `yo`
        const expected = new Expression.Variable('yo')
        const tokenizer = new Tokenizer(input)
        const tokens = tokenizer.scanTokens()
        const parser = new Parser(tokens)
        const ast = parser.parse()

        expect(ast).toEqual(expected)
    })
})

describe('Properties', () => {
    test('it can parse a property access', () => {
        const input = `identifier.property`
        const expected = new Expression.Get(
            new Expression.Variable('identifier'),
            new Token('IDENTIFIER', 'property', '', 11),
        )
        const tokenizer = new Tokenizer(input)
        const tokens = tokenizer.scanTokens()
        const parser = new Parser(tokens)
        const ast = parser.parse()

        expect(ast).toEqual(expected)
    })
})

describe('Groups', () => {
    test('it can parse a group with a literal', () => {
        const input = `(true)`
        const expected = new Expression.Grouping(new Expression.Literal(true))
        const tokenizer = new Tokenizer(input)
        const tokens = tokenizer.scanTokens()
        const parser = new Parser(tokens)
        const ast = parser.parse()

        expect(ast).toEqual(expected)
    })

    test('it can parse a group with an expression', () => {
        const input = `(1 + 2)`
        const expected = new Expression.Grouping(
            new Expression.Binary(
                new Expression.Literal(1),
                new Token('PLUS', '+', '', 3),
                new Expression.Literal(2),
            ),
        )
        const tokenizer = new Tokenizer(input)
        const tokens = tokenizer.scanTokens()
        const parser = new Parser(tokens)
        const ast = parser.parse()

        expect(ast).toEqual(expected)
    })
})

describe('Conditional Expressions', () => {
    test('it can parse a conditional expression', () => {
        const input = `if true then "yo" else "not yo"`
        const expected = new Expression.Conditional(
            new Expression.Literal(true),
            new Expression.Literal('yo'),
            new Expression.Literal('not yo'),
        )

        const tokenizer = new Tokenizer(input)
        const tokens = tokenizer.scanTokens()
        const parser = new Parser(tokens)
        const ast = parser.parse()

        expect(ast).toEqual(expected)
    })
})

describe('Logical Expressions', () => {
    test('it can parse an "and" expression', () => {
        const input = `true and false`
        const expected = new Expression.Logical(
            new Expression.Literal(true),
            new Token('AND', 'and', '', 5),
            new Expression.Literal(false),
        )

        const tokenizer = new Tokenizer(input)
        const tokens = tokenizer.scanTokens()
        const parser = new Parser(tokens)
        const ast = parser.parse()

        expect(ast).toEqual(expected)
    })

    test('it can parse an "or" expression', () => {
        const input = `true or false`
        const expected = new Expression.Logical(
            new Expression.Literal(true),
            new Token('OR', 'or', '', 5),
            new Expression.Literal(false),
        )

        const tokenizer = new Tokenizer(input)
        const tokens = tokenizer.scanTokens()
        const parser = new Parser(tokens)
        const ast = parser.parse()

        expect(ast).toEqual(expected)
    })
})

describe('Binary Expressions', () => {
    test('it can parse an "equals" expression', () => {
        const input = `true equals false`
        const expected = new Expression.Binary(
            new Expression.Literal(true),
            new Token('EQUALS', 'equals', '', 5),
            new Expression.Literal(false),
        )

        const tokenizer = new Tokenizer(input)
        const tokens = tokenizer.scanTokens()
        const parser = new Parser(tokens)
        const ast = parser.parse()

        expect(ast).toEqual(expected)
    })

    test('it can parse a "not equals" expression', () => {
        const input = `true not equals false`
        const expected = new Expression.Binary(
            new Expression.Literal(true),
            new Token('NOT_EQUALS', 'not equals', '', 5),
            new Expression.Literal(false),
        )

        const tokenizer = new Tokenizer(input)
        const tokens = tokenizer.scanTokens()
        const parser = new Parser(tokens)
        const ast = parser.parse()

        expect(ast).toEqual(expected)
    })

    test('it can parse a "greater than" expression', () => {
        const input = `1 greater than 2`
        const expected = new Expression.Binary(
            new Expression.Literal(1),
            new Token('GREATER', 'greater than', '', 2),
            new Expression.Literal(2),
        )

        const tokenizer = new Tokenizer(input)
        const tokens = tokenizer.scanTokens()
        const parser = new Parser(tokens)
        const ast = parser.parse()

        expect(ast).toEqual(expected)
    })

    test('it can parse a "greater than or equals" expression', () => {
        const input = `1 greater than or equals 2`
        const expected = new Expression.Binary(
            new Expression.Literal(1),
            new Token('GREATER_EQUALS', 'greater than or equals', '', 2),
            new Expression.Literal(2),
        )

        const tokenizer = new Tokenizer(input)
        const tokens = tokenizer.scanTokens()
        const parser = new Parser(tokens)
        const ast = parser.parse()

        expect(ast).toEqual(expected)
    })

    test('it can parse a "less than" expression', () => {
        const input = `1 less than 2`
        const expected = new Expression.Binary(
            new Expression.Literal(1),
            new Token('LESS', 'less than', '', 2),
            new Expression.Literal(2),
        )

        const tokenizer = new Tokenizer(input)
        const tokens = tokenizer.scanTokens()
        const parser = new Parser(tokens)
        const ast = parser.parse()

        expect(ast).toEqual(expected)
    })

    test('it can parse a "less than or equals" expression', () => {
        const input = `1 less than or equals 2`
        const expected = new Expression.Binary(
            new Expression.Literal(1),
            new Token('LESS_EQUALS', 'less than or equals', '', 2),
            new Expression.Literal(2),
        )

        const tokenizer = new Tokenizer(input)
        const tokens = tokenizer.scanTokens()
        const parser = new Parser(tokens)
        const ast = parser.parse()

        expect(ast).toEqual(expected)
    })

    test('it can parse an "add" expression', () => {
        const input = `1 + 2`
        const expected = new Expression.Binary(
            new Expression.Literal(1),
            new Token('PLUS', '+', '', 2),
            new Expression.Literal(2),
        )

        const tokenizer = new Tokenizer(input)
        const tokens = tokenizer.scanTokens()
        const parser = new Parser(tokens)
        const ast = parser.parse()

        expect(ast).toEqual(expected)
    })

    test('it can parse a "subtract" expression', () => {
        const input = `1 - 2`
        const expected = new Expression.Binary(
            new Expression.Literal(1),
            new Token('MINUS', '-', '', 2),
            new Expression.Literal(2),
        )

        const tokenizer = new Tokenizer(input)
        const tokens = tokenizer.scanTokens()
        const parser = new Parser(tokens)
        const ast = parser.parse()

        expect(ast).toEqual(expected)
    })

    test('it can parse a "multiply" expression', () => {
        const input = `1 * 2`
        const expected = new Expression.Binary(
            new Expression.Literal(1),
            new Token('STAR', '*', '', 2),
            new Expression.Literal(2),
        )

        const tokenizer = new Tokenizer(input)
        const tokens = tokenizer.scanTokens()
        const parser = new Parser(tokens)
        const ast = parser.parse()

        expect(ast).toEqual(expected)
    })

    test('it can parse a "divide" expression', () => {
        const input = `1 / 2`
        const expected = new Expression.Binary(
            new Expression.Literal(1),
            new Token('SLASH', '/', '', 2),
            new Expression.Literal(2),
        )

        const tokenizer = new Tokenizer(input)
        const tokens = tokenizer.scanTokens()
        const parser = new Parser(tokens)
        const ast = parser.parse()

        expect(ast).toEqual(expected)
    })
})

describe('Unary Expressions', () => {
    test('it can parse a "not" expression', () => {
        const input = `not true`
        const expected = new Expression.Unary(
            new Token('NOT', 'not', '', 0),
            new Expression.Literal(true),
        )

        const tokenizer = new Tokenizer(input)
        const tokens = tokenizer.scanTokens()
        const parser = new Parser(tokens)
        const ast = parser.parse()

        expect(ast).toEqual(expected)
    })

    test('it can parse a "negative number" expression', () => {
        const input = `-1`
        const expected = new Expression.Unary(
            new Token('MINUS', '-', '', 0),
            new Expression.Literal(1),
        )

        const tokenizer = new Tokenizer(input)
        const tokens = tokenizer.scanTokens()
        const parser = new Parser(tokens)
        const ast = parser.parse()

        expect(ast).toEqual(expected)
    })
})

describe('Call expressions', () => {
    test('it can parse a function call without any arguments', () => {
        const input = `print()`
        const expected = new Expression.Call(
            new Expression.Variable('print'),
            new Token('RIGHT_PARENTHESIS', ')', '', 6),
            [],
        )

        const tokenizer = new Tokenizer(input)
        const tokens = tokenizer.scanTokens()
        const parser = new Parser(tokens)
        const ast = parser.parse()

        expect(ast).toEqual(expected)
    })

    test('it can parse a function call with one argument', () => {
        const input = `print("arg1")`
        const expected = new Expression.Call(
            new Expression.Variable('print'),
            new Token('RIGHT_PARENTHESIS', ')', '', 12),
            [new Expression.Literal('arg1')],
        )

        const tokenizer = new Tokenizer(input)
        const tokens = tokenizer.scanTokens()
        const parser = new Parser(tokens)
        const ast = parser.parse()

        expect(ast).toEqual(expected)
    })

    test('it can parse a function call with multiple arguments', () => {
        const input = `print("arg1", 2)`
        const expected = new Expression.Call(
            new Expression.Variable('print'),
            new Token('RIGHT_PARENTHESIS', ')', '', 15),
            [new Expression.Literal('arg1'), new Expression.Literal(2)],
        )

        const tokenizer = new Tokenizer(input)
        const tokens = tokenizer.scanTokens()
        const parser = new Parser(tokens)
        const ast = parser.parse()

        expect(ast).toEqual(expected)
    })

    test('it cannot parse function calls with more than 255 arguments', () => {
        const args = new Array(256).fill('X').join(', ')
        const input = `print(${args})`

        const runner = () => {
            const tokenizer = new Tokenizer(input)
            const tokens = tokenizer.scanTokens()
            const parser = new Parser(tokens)
            const ast = parser.parse()
        }

        expect(runner).toThrow(
            new ParserError("Can't have more than 255 arguments."),
        )
    })

    test('it can chain function calls', () => {
        const input = `print()()`
        const expected = new Expression.Call(
            new Expression.Call(
                new Expression.Variable('print'),
                new Token('RIGHT_PARENTHESIS', ')', '', 6),
                [],
            ),
            new Token('RIGHT_PARENTHESIS', ')', '', 8),
            [],
        )

        const tokenizer = new Tokenizer(input)
        const tokens = tokenizer.scanTokens()
        const parser = new Parser(tokens)
        const ast = parser.parse()

        expect(ast).toEqual(expected)
    })

    test('arguments can be expressions', () => {
        const input = `print(1 + 2)`
        const expected = new Expression.Call(
            new Expression.Variable('print'),
            new Token('RIGHT_PARENTHESIS', ')', '', 11),
            [
                new Expression.Binary(
                    new Expression.Literal(1),
                    new Token('PLUS', '+', '', 8),
                    new Expression.Literal(2),
                ),
            ],
        )

        const tokenizer = new Tokenizer(input)
        const tokens = tokenizer.scanTokens()
        const parser = new Parser(tokens)
        const ast = parser.parse()

        expect(ast).toEqual(expected)
    })
})

describe('Nested Expressions', () => {
    // test.todo('comparison expressions are evaluated before equality expressions')
    test.todo(
        'order of operations (equality -> comparison -> terminus -> factor -> unary -> primary)',
    )
})

describe('Errors', () => {
    test.todo('error: expected expression')
    test.todo('error: consume (parenthasis)')
})
