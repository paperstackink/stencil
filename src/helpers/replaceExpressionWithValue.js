import CompilationError from '@/errors/CompilationError'

export default function (source, values) {
    const usedValues = []
    const pattern = /{{\s*(?<name>\w+)?\s*}}/g
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

        const value = values[name]

        output = source.replaceAll(outputExpression, value)
    }

    return [output, usedValues]
}
