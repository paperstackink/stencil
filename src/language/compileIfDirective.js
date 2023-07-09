import compileNode from '@/language/compileNode'
import Parser from '@/expressions/Parser'
import Tokenizer from '@/expressions/Tokenizer'
import Interpreter from '@/expressions/Interpreter'

export default function (node, context) {
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

    let normalisedValues = { ...context.environment }

    if (normalisedValues.hasOwnProperty('class')) {
        normalisedValues.className = normalisedValues.class
        delete normalisedValues.class
    }

    const parser = new Parser(normalisedTokens)
    const ast = parser.parse()

    const interpreter = new Interpreter(ast, normalisedValues)

    if (!interpreter.passes()) {
        return []
    }

    return node.children.flatMap(node => compileNode(node, context))
}
