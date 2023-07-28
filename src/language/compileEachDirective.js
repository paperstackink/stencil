import compileNode from '@/language/compileNode'
import Parser from '@/expressions/Parser'
import Tokenizer from '@/expressions/Tokenizer'
import Interpreter from '@/expressions/Interpreter'
import CompilationError from '@/errors/CompilationError'

export default function (node, context) {
    let children = []

    const record = context.environment[node.properties.record]

    if (!(record instanceof Map)) {
        throw new CompilationError(
            "Cannot loop over something that's not a record.",
        )
    }

    record.forEach((value, key) => {
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
