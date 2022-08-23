import { unified } from 'unified'
import { visit, SKIP } from 'unist-util-visit'
import { select } from 'hast-util-select'
import parse from 'rehype-parse-ns'

import isHtml from '@/helpers/isHtml'

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

        if (isHtml(value)) {
            // When parsing the component definition it wraps it's in a `root` element.
            const root = unified().use(parse, { fragment: true }).parse(value) // Trim so that no `text` nodes with whitespace are created

            const content = root.children

            // Split the string into,
            // the corresponding html nodes,
            // or a regular text node if it's a regular string
            let parts = output
                .split(pattern)
                .map((part) => {
                    if (part === name) {
                        return [...content]
                    }

                    return [
                        {
                            type: 'text',
                            value: part,
                        },
                    ]
                })
                .flat(1)

            output = parts
        } else if (Array.isArray(output)) {
            output = output.map((node) => {
                if (node.type === 'text') {
                    node.value = node.value.replaceAll(outputExpression, value)
                }

                return node
            })
        } else {
            output = source.replaceAll(outputExpression, value)
        }
    }

    return output
}

const output = (options = defaultOptions) => {
    const { values } = options
    const usedValues = []

    return (tree, vfile) => {
        visit(tree, (node, index, parent) => {
            if (node.type === 'text') {
                // If there is HTML:
                // - Then change the type of the node
                //    - Actually it should be split into an array of nodes (by resolveExpression)
                //        - Because then we can check whether the result is an array
                //    - Where the text nodes are still text nodes
                //    - But the other stuff is html

                const content = resolveExpression(
                    node.value,
                    values,
                    usedValues,
                )

                if (Array.isArray(content)) {
                    parent.children.splice(index, 1, ...content)

                    if (usedValues.length > 0) {
                        tree.meta = {
                            ...(tree.meta ? tree.meta : {}),
                            usedValues,
                        }
                    }

                    return [SKIP, index]
                } else {
                    node.value = content
                }
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
