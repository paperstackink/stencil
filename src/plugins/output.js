import { visit, SKIP } from 'unist-util-visit'

import CompilationError from '@/errors/CompilationError'

const defaultOptions = {
    values: {},
}

const resolveExpression = (source, values, usedValues) => {
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
            const identifier = name === 'className' ? 'class' : name

            throw new CompilationError(`Value '${identifier}' is not defined.`)
        }

        usedValues.push(name)

        let value = values[name]

        if (Array.isArray(value)) {
            value = value.join(' ')
        }

        output = source.replaceAll(outputExpression, value)
    }

    return output
}

const output = (options = defaultOptions) => {
    const { values } = options
    const usedValues = []

    return (tree, vfile) => {
        visit(tree, (node) => {
            if (node.type === 'text') {
                node.value = resolveExpression(node.value, values, usedValues)
            }

            if (node.type === 'element') {
                const propertiesAsArray = Object.entries(node.properties)

                let newPropertiesAsArray = propertiesAsArray.map(
                    ([name, value]) => {
                        let newValue = value

                        if (Array.isArray(value)) {
                            newValue = value.map((value) => {
                                return resolveExpression(
                                    value,
                                    values,
                                    usedValues,
                                )
                            })
                            // console.log('XXXXXXXXXXXXX Value:', value)
                            // console.log('XXXXXXXXXXXXX New value:', newValue)
                        } else if (typeof value === 'string') {
                            newValue = resolveExpression(
                                value,
                                values,
                                usedValues,
                            )
                        }

                        return [name, newValue]
                    },
                )

                node.properties = Object.fromEntries(newPropertiesAsArray)
            }

            if (usedValues.length > 0) {
                tree.meta = {
                    ...(tree.meta ? tree.meta : {}),
                    usedValues,
                }
            }
        })
    }
}

export default output
