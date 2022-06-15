import { SKIP } from 'unified'
import { visit } from 'unist-util-visit'

import CompilationError from '@/errors/CompilationError'

const defaultOptions = {
    values: {},
}

const resolveExpression = (source, values) => {
    const pattern = /{{(?<name>\w+)?}}/g

    const expressions = source.matchAll(pattern)

    let output = source

    for (const match of expressions) {
        const groups = match.groups
        const name = groups.name
        const outputExpression = match[0]

        if (!name) {
            throw new CompilationError(`Empty output expression '{{ }}'`)
        }

        if (!(name in values)) {
            throw new CompilationError(`Value '${name}' is not defined.`)
        }

        output = source.replace(outputExpression, values[name])
    }

    return output
}

const globalOutput = (options = defaultOptions) => {
    const { values } = options

    return (tree, vfile) => {
        visit(tree, (node) => {
            if (node.type === 'text') {
                node.value = resolveExpression(node.value, values)
            }

            if (node.type === 'element') {
                const propertiesAsArray = Object.entries(node.properties)

                let newPropertiesAsArray = propertiesAsArray.map(
                    ([name, value]) => {
                        let newValue = value

                        if (Array.isArray(value)) {
                            newValue = value.map((value) => {
                                return resolveExpression(value, values)
                            })
                        } else if (typeof value === 'string') {
                            newValue = resolveExpression(value, values)
                        }

                        return [name, newValue]
                    },
                )

                node.properties = Object.fromEntries(newPropertiesAsArray)
            }
        })
    }
}

export default globalOutput
