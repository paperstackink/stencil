import compileNode from '@/language/compileNode'
import Parser from '@/expressions/Parser'
import Tokenizer from '@/expressions/Tokenizer'
import Interpreter from '@/expressions/Interpreter'
import CompilationError from '@/errors/CompilationError'
import compileExpression from '@/language/compileExpression'

export default function (node, context) {
    let children = []

    const tokenizer = new Tokenizer(node.properties.record)
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
        normalisedValues.className = values.class
        delete normalisedValues.class
    }

    const parser = new Parser(normalisedTokens)
    const ast = parser.parse()

    const interpreter = new Interpreter(ast, normalisedValues)
    const literal = interpreter.interpret()

    if (!(literal.value instanceof Map)) {
        throw new CompilationError(
            "Cannot loop over something that's not a record.",
        )
    }

    literal.value.forEach((value, key) => {
        const compiled = node.children.flatMap(child => {
            return compileNode(child, {
                ...context,
                environment: {
                    ...context.environment,
                    [node.properties.variable]: value,
                    ...(node.properties.key
                        ? { [node.properties.key]: key }
                        : {}),
                },
            })
        })

        children.push(...compiled)
    })

    return children
}
