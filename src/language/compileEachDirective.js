import compileNode from '@/language/compileNode'
import Parser from '@/expressions/Parser'
import Tokenizer from '@/expressions/Tokenizer'
import Interpreter from '@/expressions/Interpreter'
import LoopingNonRecord from '@/errors/LoopingNonRecord'
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
    const literal = interpreter.interpret()

    if (!(literal.value instanceof Map)) {
        throw new LoopingNonRecord(literal.value, node.position)
    }

    const usedIdentifiers = normalisedTokens
        .filter(token => token.type === 'IDENTIFIER')
        .map(token => token.lexeme)

    literal.value.forEach((value, key) => {
        const compiled = node.children.flatMap(child => {
            return compileNode(child, {
                ...context,
                environment: {
                    ...context.environment,
                    local: {
                        ...context.environment.local,
                        [node.properties.variable]: value,
                        ...(node.properties.key
                            ? { [node.properties.key]: key }
                            : {}),
                    },
                },
            })
        })

        if (compiled.length > 0) {
            compiled[0].meta = {
                usedIdentifiers: [
                    ...(compiled[0].meta.usedIdentifiers || []),
                    ...usedIdentifiers,
                ],
            }
        }

        children.push(...compiled)
    })

    return children
}
