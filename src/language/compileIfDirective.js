import compileNode from '@/language/compileNode'
import Parser from '@/expressions/Parser'
import Tokenizer from '@/expressions/Tokenizer'
import Interpreter from '@/expressions/Interpreter'

export default function (node, context) {
    try {
        const condition = decodeURI(node.properties.condition)

        const tokenizer = new Tokenizer(condition)
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

        let values = {
            ...context.environment.global,
            ...context.environment.local,
        }

        if (values.hasOwnProperty('class')) {
            values.className = values.class
            delete values.class
        }

        const parser = new Parser(normalisedTokens)
        const ast = parser.parse()

        const interpreter = new Interpreter(ast, values)

        if (!interpreter.passes()) {
            return []
        }

        if (node.children.length > 0) {
            const usedIdentifiers = normalisedTokens
                .filter(token => token.type === 'IDENTIFIER')
                .map(token => token.lexeme)

            node.children[0].meta = {
                usedIdentifiers,
            }
        }

        return node.children.flatMap(node => compileNode(node, context))
    } catch (error) {
        error.position = node.position
        error.expression = node.properties.record

        throw error
    }
}
