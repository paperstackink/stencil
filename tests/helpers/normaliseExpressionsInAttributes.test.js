import normaliseExpressionsInAttributes from '@/helpers/normaliseExpressionsInAttributes'
import CompilationError from '@/errors/CompilationError'

test('it can normalise an expression in an attribute value', () => {
    const attributes = {
        class: ['{{', 'expression', '}}'],
    }
    const output = normaliseExpressionsInAttributes(attributes)

    expect(output).toEqual({
        class: ['{{ expression }}'],
    })
})

test('it can handle other items before and after', () => {
    const attributes = {
        class: ['before', '{{', 'expression', '}}', 'after'],
    }
    const output = normaliseExpressionsInAttributes(attributes)

    expect(output).toEqual({
        class: ['before', '{{ expression }}', 'after'],
    })
})

test('it can normalise multiple expressions in an attribute value', () => {
    const attributes = {
        class: [
            'before',
            '{{',
            'expression',
            '}}',
            'middle',
            '{{',
            'expression',
            '}}',
            'after',
        ],
    }
    const output = normaliseExpressionsInAttributes(attributes)

    expect(output).toEqual({
        class: [
            'before',
            '{{ expression }}',
            'middle',
            '{{ expression }}',
            'after',
        ],
    })
})

test('it can normalise an expression concatenated with a string', () => {
    const attributes = {
        class: ['variant-{{', 'expression', '}}'],
    }
    const output = normaliseExpressionsInAttributes(attributes)

    expect(output).toEqual({
        class: ['variant-{{ expression }}'],
    })
})

test('it ignores non-array attribute values', () => {
    const attributes = {
        id: 'yo',
    }
    const output = normaliseExpressionsInAttributes(attributes)

    expect(output).toEqual({
        id: 'yo',
    })
})

test('it errors if there are nested expressions', () => {
    const attributes = {
        class: ['{{', 'expression', '{{', 'nested', '}}', '}}'],
    }
    const runner = () => normaliseExpressionsInAttributes(attributes)

    expect(runner).toThrow(
        new CompilationError('Nested expressions are not supported.'),
    )
})

test('it errors if an expression is not closed', () => {
    const attributes = {
        class: ['{{', 'expression'],
    }
    const runner = () => normaliseExpressionsInAttributes(attributes)

    expect(runner).toThrow(new CompilationError('Unclosed expression.'))
})

test('it errors if there are multiple expressions and the last one is not closed', () => {
    const attributes = {
        class: ['{{', 'expression', '}}', '{{', 'another'],
    }
    const runner = () => normaliseExpressionsInAttributes(attributes)

    expect(runner).toThrow(new CompilationError('Unclosed expression.'))
})
