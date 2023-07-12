import Printer from '@/expressions/Printer'
import Expression from '@/expressions/Expression'

const print = literal => {
    const printer = new Printer(literal)
    const output = printer.print()

    return output
}

describe('Literals', () => {
    test('it can print a boolean ', () => {
        const input = new Expression.Literal(false)
        const expected = `false`

        const result = print(input)

        expect(result).toBe(expected)
    })

    test('it can print "null"', () => {
        const input = new Expression.Literal(null)
        const expected = ``

        const result = print(input)

        expect(result).toBe(expected)
    })

    test('it can print numbers', () => {
        const input = new Expression.Literal(10)
        const expected = `10`

        const result = print(input)

        expect(result).toBe(expected)
    })

    test('it can print strings', () => {
        const input = new Expression.Literal('yo')
        const expected = `yo`

        const result = print(input)

        expect(result).toBe(expected)
    })
})
