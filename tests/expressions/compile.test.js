import compileExpression from '@/language/compileExpression'
import compileExpressions from '@/language/compileExpressions'
import CompilationError from '@/errors/CompilationError'
import Expression from '@/expressions/Expression'

describe('Single expression', () => {
    test('it can compile an expression', () => {
        const input = `1 + 2`
        const expected = `3`

        const [result] = compileExpression(input)

        expect(result).toBe(expected)
    })

    test('it can compile an expression with a variable', () => {
        const input = `name`
        const expected = `resolved`

        const [result] = compileExpression(input, {
            name: 'resolved',
        })

        expect(result).toBe(expected)
    })

    test('it can return all identifiers used in the expression', () => {
        const input = `identifier1 + identifier2`
        const expected = `something`

        const [_, usedIdentifiers] = compileExpression(input, {
            identifier1: 'some',
            identifier2: 'thing',
            identifier3: 'noop',
            identifier4: 'noop',
        })

        expect(usedIdentifiers.length).toBe(2)
        expect(usedIdentifiers).toContain('identifier1')
        expect(usedIdentifiers).toContain('identifier2')
    })
})

describe('Source with expressions', () => {
    test('it can compile text with an expression', () => {
        const input = `This is text with an {{ type }}`
        const expected = `This is text with an expression`

        const [result] = compileExpressions(input, {
            type: 'expression',
        })

        expect(result).toBe(expected)
    })

    test('it can compile text with multiple expressions', () => {
        const input = `This is text with not {{ low }} but {{ high }} expression`
        const expected = `This is text with not one but two expression`

        const [result] = compileExpressions(input, {
            low: 'one',
            high: 'two',
        })

        expect(result).toBe(expected)
    })

    test('it can compile text with an advanced expression', () => {
        const input = `1 + 2 is {{ 1 + 2 }}`
        const expected = `1 + 2 is 3`

        const [result] = compileExpressions(input, {
            type: 'expression',
        })

        expect(result).toBe(expected)
    })

    test('it can compile text with an "or" expression', () => {
        const input = `Here goes {{ word or '' }}`
        const expected = `Here goes nothing`

        const [result] = compileExpressions(input, {
            word: 'nothing',
        })

        expect(result).toBe(expected)
    })

    test('it can return all identifiers used to compile the expressions', () => {
        const input = `This is text with not {{ low }} but {{ high }} expression`

        const [_, usedIdentifiers] = compileExpressions(input, {
            low: 'one',
            high: 'two',
            middle: 'noop',
        })

        expect(usedIdentifiers.length).toBe(2)
        expect(usedIdentifiers).toContain('low')
        expect(usedIdentifiers).toContain('high')
    })
})
