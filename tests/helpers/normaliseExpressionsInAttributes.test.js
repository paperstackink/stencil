import normaliseExpressionsInAttributes from '@/helpers/normaliseExpressionsInAttributes'
import CompilationError from '@/errors/CompilationError'
import NestedExpression from '@/errors/NestedExpression'
import UnclosedExpression from '@/errors/UnclosedExpression'

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

test('it errors if there are nested expressions in array attributes', () => {
    const attributes = {
        class: ['{{', 'expression', '{{', 'nested', '}}', '}}'],
    }
    const runner = () => normaliseExpressionsInAttributes(attributes)

    expect(runner).toThrow(
        new CompilationError('Nested expressions are not supported.'),
    )
})

test('it errors if there are nested expressions in non-array attributes', () => {
    const attributes = {
        yo: '{{ expression {{ nested }} }}',
    }
    const runner = () => normaliseExpressionsInAttributes(attributes)

    expect(runner).toThrow(new NestedExpression())
})

test('it ignores multiple expressions in a non-array attributes', () => {
    const attributes = {
        yo: '{{ expression }} {{ nested }}',
    }
    const runner = () => normaliseExpressionsInAttributes(attributes)

    expect(runner).not.toThrow()
})

test('it errors if an expression is not closed in array attributes', () => {
    const attributes = {
        class: ['{{', 'expression'],
    }
    const runner = () => normaliseExpressionsInAttributes(attributes)

    expect(runner).toThrow(new CompilationError('Unclosed expression.'))
})

test('it errors if an expression is not closed on non-array attributes', () => {
    const attributes = {
        id: '{{ expression }} {{ another ',
    }
    const runner = () => normaliseExpressionsInAttributes(attributes)

    expect(runner).toThrow(new UnclosedExpression())
})

test('it errors if there are multiple expressions and the last one is not closed', () => {
    const attributes = {
        class: ['{{', 'expression', '}}', '{{', 'another'],
    }
    const runner = () => normaliseExpressionsInAttributes(attributes)

    expect(runner).toThrow(new CompilationError('Unclosed expression.'))
})
