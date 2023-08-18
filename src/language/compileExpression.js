import Parser from '@/expressions/Parser'
import Printer from '@/expressions/Printer'
import Tokenizer from '@/expressions/Tokenizer'
import Interpreter from '@/expressions/Interpreter'
import CompilationError from '@/errors/CompilationError'

export default function (source, values = {}, print = true) {
    try {
        const tokenizer = new Tokenizer(source)
        const tokens = tokenizer.scanTokens()
        const normalisedTokens = tokens.map(token => {
            if (token.type !== 'IDENTIFIER') {
                return token
            }

            if (token.lexeme !== 'class') {
                return token
            }

            return {
                ...token,
                lexeme: 'className',
            }
        })

        let normalisedValues = { ...values }

        if (values.hasOwnProperty('class')) {
            normalisedValues.className = values.class
            delete normalisedValues.class
        }

        const parser = new Parser(normalisedTokens)
        const ast = parser.parse()

        const interpreter = new Interpreter(ast, normalisedValues)
        const literal = interpreter.interpret()

        const usedIdentifiers = normalisedTokens
            .filter(token => token.type === 'IDENTIFIER')
            .map(token => token.lexeme)

        if (!print) {
            return [literal, usedIdentifiers]
        }

        const printer = new Printer(literal)
        const output = printer.print()

        return [output, usedIdentifiers]
    } catch (error) {
        throw new CompilationError(error.message)
    }
}
