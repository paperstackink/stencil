import Token from '@/expressions/Token'
import Parser from '@/expressions/Parser'
import Tokenizer from '@/expressions/Tokenizer'
import Expression from '@/expressions/Expression'
import Interpreter from '@/expressions/Interpreter'
import RuntimeError from '@/expressions/errors/RuntimeError'
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

const evaluateTruthiness = (input, scope) => {
    const tokenizer = new Tokenizer(input)
    const tokens = tokenizer.scanTokens()
    const parser = new Parser(tokens)
    const ast = parser.parse()
    const interpreter = new Interpreter(ast, scope)
    const output = interpreter.passes()

    return output
}

describe('Literals', () => {
    test('it can evaluate booleans', () => {
        const input = `false`
        const expected = new Expression.Literal(false)
        const output = evaluate(input)

        expect(output).toEqual(expected)
    })

    test('it can evaluate "null"', () => {
        const input = `null`
        const expected = new Expression.Literal(null)
        const output = evaluate(input)

        expect(output).toEqual(expected)
    })

    test('it can evaluate numbers', () => {
        const input = `1.2`
        const expected = new Expression.Literal(1.2)
        const output = evaluate(input)

        expect(output).toEqual(expected)
    })

    test('it can evaluate strings', () => {
        const input = `"yo"`
        const expected = new Expression.Literal('yo')
        const output = evaluate(input)

        expect(output).toEqual(expected)
    })

    // We don't parse records so we have to manually create the AST
    test('it can evaluate records', () => {
        const input = new Map([
            ['a', 'yo'],
            ['b', 10],
        ])
        const expected = new Expression.Literal(input)

        const ast = new Expression.Literal(input)
        const interpreter = new Interpreter(ast)
        const output = interpreter.interpret()

        expect(output).toEqual(expected)
    })
})

describe('Properties', () => {
    describe('Records', () => {
        test('it can read a property on a record', () => {
            const input = `record.property`
            const expected = new Expression.Literal('value')
            const output = evaluate(input, {
                record: new Map([['property', 'value']]),
            })

            expect(output).toEqual(expected)
        })

        test('it can read nested propertie', () => {
            const input = `record.nested.property`
            const expected = new Expression.Literal('value')
            const output = evaluate(input, {
                record: new Map([['nested', new Map([['property', 'value']])]]),
            })

            expect(output).toEqual(expected)
        })

        test("it returns null if the property doesn't exist on a record", () => {
            const input = `record.property`
            const expected = new Expression.Literal(null)
            const output = evaluate(input, {
                record: new Map([]),
            })

            expect(output).toEqual(expected)
        })

        test("it can read 'type' on records", () => {
            const input = `record.type`
            const expected = new Expression.Literal('record')
            const output = evaluate(input, {
                record: new Map(),
            })

            expect(output).toEqual(expected)
        })
    })

    describe('Literals', () => {
        test("it can read 'type' on strings", () => {
            const input = `"some string".type`
            const expected = new Expression.Literal('string')
            const output = evaluate(input)

            expect(output).toEqual(expected)
        })

        test("it can read 'type' on booleans", () => {
            const input = `true.type`
            const expected = new Expression.Literal('boolean')
            const output = evaluate(input)

            expect(output).toEqual(expected)
        })

        test("it can read 'type' on numbers", () => {
            const input = `1.2.type`
            const expected = new Expression.Literal('number')
            const output = evaluate(input)

            expect(output).toEqual(expected)
        })

        test('it errors if reading properties on null', () => {
            const input = `null.type`
            const expected = new Expression.Literal('null')
            const runner = () =>
                evaluate(input, {
                    record: 'string',
                })

            expect(runner).toThrow(
                new RuntimeError("Cannot read properties on 'null'"),
            )
        })

        test("it returns null if the property doesn't exist on non-records", () => {
            const input = `"some string".random`
            const expected = new Expression.Literal(null)
            const output = evaluate(input)

            expect(output).toEqual(expected)
        })
    })

    describe('Variables', () => {
        test("it can read 'type' on variables", () => {
            const input = `variable.type`
            const expected = new Expression.Literal('string')
            const output = evaluate(input, {
                variable: 'Yo',
            })

            expect(output).toEqual(expected)
        })
    })
})

describe('Variables', () => {
    test('it can evaluate variable names', () => {
        const input = `name`
        const expected = new Expression.Literal('value')
        const output = evaluate(input, {
            name: 'value',
        })

        expect(output).toEqual(expected)
    })

    test('undefined identifiers become "null"', () => {
        const input = `name`
        const expected = new Expression.Literal(null)

        const output = evaluate(input, {})

        expect(output).toEqual(expected)
    })
})

describe('Groups', () => {
    test('it can evaluate a group', () => {
        const input = `(2)`
        const expected = new Expression.Literal(2)
        const output = evaluate(input)

        expect(output).toEqual(expected)
    })
})

describe('Conditional Expressions', () => {
    test('it can evaluate a true conditional', () => {
        const input = `if true then 2 else 3`
        const expected = new Expression.Literal(2)
        const output = evaluate(input)

        expect(output).toEqual(expected)
    })
    test('it can evaluate a false conditional', () => {
        const input = `if false then 2 else 3`
        const expected = new Expression.Literal(3)
        const output = evaluate(input)

        expect(output).toEqual(expected)
    })
})

describe('Logical Expressions', () => {
    test('it can evaluate an "or" expression', () => {
        const input = `true or false`
        const expected = new Expression.Literal(true)
        const output = evaluate(input)

        expect(output).toEqual(expected)
    })
    test('it can evaluate an "and" expression', () => {
        const input = `true and false`
        const expected = new Expression.Literal(false)
        const output = evaluate(input)

        expect(output).toEqual(expected)
    })
})

describe('Binary Expressions', () => {
    test('it can evaluate an equality expression', () => {
        const input = `2 equals 2`
        const expected = new Expression.Literal(true)
        const output = evaluate(input)

        expect(output).toEqual(expected)
    })

    test('it can evaluate a comparison expression', () => {
        const input = `2 less than 1`
        const expected = new Expression.Literal(false)
        const output = evaluate(input)

        expect(output).toEqual(expected)
    })

    test('it can evaluate a terminus expression', () => {
        const input = `2 + 1`
        const expected = new Expression.Literal(3)
        const output = evaluate(input)

        expect(output).toEqual(expected)
    })

    test('it can evaluate a factor expression', () => {
        const input = `2 * 3`
        const expected = new Expression.Literal(6)
        const output = evaluate(input)

        expect(output).toEqual(expected)
    })
})

describe('Unary Expressions', () => {
    test('it can evaluate a unary expression', () => {
        const input = `not true`
        const expected = new Expression.Literal(false)
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
    test('it can evaluate whether an expression is truthy', () => {
        const input = `1 + 2 equals 3`
        const expected = true
        const output = evaluateTruthiness(input)

        expect(output).toEqual(expected)
    })

    test('it can evaluate whether an expression is truthy', () => {
        const input = `1 + 2 equals 4`
        const expected = false
        const output = evaluateTruthiness(input)

        expect(output).toEqual(expected)
    })
})
