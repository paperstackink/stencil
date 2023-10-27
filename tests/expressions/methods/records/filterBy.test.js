import FilterBy from '@/expressions/methods/records/FilterBy'
import Expression from '@/expressions/Expression'

import NonStringFieldInFilterFunction from '@/expressions/errors/NonStringFieldInFilterFunction'
import InvalidOperatorInFilterFunction from '@/expressions/errors/InvalidOperatorInFilterFunction'
import InvalidContainsValueInFilterFunction from '@/expressions/errors/InvalidContainsValueInFilterFunction'
import InvalidNumberOperatorInFilterFunction from '@/expressions/errors/InvalidNumberOperatorInFilterFunction'

describe('Functionality', () => {
	test("it filters out anything that doesn't match the condition", () => {
		const record = new Expression.Literal(
			new Map([
				['item1', new Map([['matches', true]])],
				['item2', new Map([['matches', false]])],
				['item3', new Map([['matches', true]])],
			]),
		)
		const callable = new FilterBy(record)

		const output = callable.call([
			new Expression.Literal('matches'),
			new Expression.Literal('equals'),
			new Expression.Literal(true),
		])

		expect(Array.from(output.value)).toEqual([
			['item1', new Map([['matches', true]])],
			['item3', new Map([['matches', true]])],
		])
	})

	test('it uses the equals operator if an operator argument is not provided', () => {
		const record = new Expression.Literal(
			new Map([
				['item1', new Map([['matches', true]])],
				['item2', new Map([['matches', false]])],
				['item3', new Map([['matches', true]])],
			]),
		)
		const callable = new FilterBy(record)

		const output = callable.call([
			new Expression.Literal('matches'),
			new Expression.Literal(true),
		])

		expect(Array.from(output.value)).toEqual([
			['item1', new Map([['matches', true]])],
			['item3', new Map([['matches', true]])],
		])
	})

	test('it assumes the value should be truthy if omitting the value', () => {
		const record = new Expression.Literal(
			new Map([
				['item1', new Map([['title', 'Yo 1']])],
				['item2', new Map([['title', null]])],
				['item3', new Map([['title', 'Yo 2']])],
			]),
		)
		const callable = new FilterBy(record)

		const output = callable.call([new Expression.Literal('title')])

		expect(Array.from(output.value)).toEqual([
			['item1', new Map([['title', 'Yo 1']])],
			['item3', new Map([['title', 'Yo 2']])],
		])
	})
})

describe('Operators', () => {
	test('it can use the "equals" operator', () => {
		const record = new Expression.Literal(
			new Map([
				['item1', new Map([['matches', true]])],
				['item2', new Map([['matches', false]])],
				['item3', new Map([['matches', true]])],
			]),
		)
		const callable = new FilterBy(record)

		const output = callable.call([
			new Expression.Literal('matches'),
			new Expression.Literal('equals'),
			new Expression.Literal(true),
		])

		expect(Array.from(output.value)).toEqual([
			['item1', new Map([['matches', true]])],
			['item3', new Map([['matches', true]])],
		])
	})

	test('it can use the "not equals" operator', () => {
		const record = new Expression.Literal(
			new Map([
				['item1', new Map([['matches', true]])],
				['item2', new Map([['matches', false]])],
				['item3', new Map([['matches', true]])],
			]),
		)
		const callable = new FilterBy(record)

		const output = callable.call([
			new Expression.Literal('matches'),
			new Expression.Literal('not equals'),
			new Expression.Literal(true),
		])

		expect(Array.from(output.value)).toEqual([
			['item2', new Map([['matches', false]])],
		])
	})

	test('it can use the "greater than" operator', () => {
		const record = new Expression.Literal(
			new Map([
				['item1', new Map([['count', 2]])],
				['item2', new Map([['count', 3]])],
				['item3', new Map([['count', 4]])],
			]),
		)
		const callable = new FilterBy(record)

		const output = callable.call([
			new Expression.Literal('count'),
			new Expression.Literal('greater than'),
			new Expression.Literal(3),
		])

		expect(Array.from(output.value)).toEqual([
			['item3', new Map([['count', 4]])],
		])
	})

	test('it can use the "greater than or equals" operator', () => {
		const record = new Expression.Literal(
			new Map([
				['item1', new Map([['count', 2]])],
				['item2', new Map([['count', 3]])],
				['item3', new Map([['count', 4]])],
			]),
		)
		const callable = new FilterBy(record)

		const output = callable.call([
			new Expression.Literal('count'),
			new Expression.Literal('greater than or equals'),
			new Expression.Literal(3),
		])

		expect(Array.from(output.value)).toEqual([
			['item2', new Map([['count', 3]])],
			['item3', new Map([['count', 4]])],
		])
	})

	test('it can use the "less than" operator', () => {
		const record = new Expression.Literal(
			new Map([
				['item1', new Map([['count', 2]])],
				['item2', new Map([['count', 3]])],
				['item3', new Map([['count', 4]])],
			]),
		)
		const callable = new FilterBy(record)

		const output = callable.call([
			new Expression.Literal('count'),
			new Expression.Literal('less than'),
			new Expression.Literal(3),
		])

		expect(Array.from(output.value)).toEqual([
			['item1', new Map([['count', 2]])],
		])
	})

	test('it can use the "less than or equals" operator', () => {
		const record = new Expression.Literal(
			new Map([
				['item1', new Map([['count', 2]])],
				['item2', new Map([['count', 3]])],
				['item3', new Map([['count', 4]])],
			]),
		)
		const callable = new FilterBy(record)

		const output = callable.call([
			new Expression.Literal('count'),
			new Expression.Literal('less than or equals'),
			new Expression.Literal(3),
		])

		expect(Array.from(output.value)).toEqual([
			['item1', new Map([['count', 2]])],
			['item2', new Map([['count', 3]])],
		])
	})

	test('it can use the "contains" operator', () => {
		const record = new Expression.Literal(
			new Map([
				['item1', new Map([['path', '/articles/1']])],
				['item2', new Map([['path', '/links/2']])],
				['item3', new Map([['path', '/articles/3']])],
			]),
		)
		const callable = new FilterBy(record)

		const output = callable.call([
			new Expression.Literal('path'),
			new Expression.Literal('contains'),
			new Expression.Literal('articles'),
		])

		expect(Array.from(output.value)).toEqual([
			['item1', new Map([['path', '/articles/1']])],
			['item3', new Map([['path', '/articles/3']])],
		])
	})

	test('it can use the "truthy" operator', () => {
		const record = new Expression.Literal(
			new Map([
				['item1', new Map([['title', 'Yo 1']])],
				['item2', new Map([['title', null]])],
				['item3', new Map([['title', 'Yo 2']])],
			]),
		)
		const callable = new FilterBy(record)

		const output = callable.call([
			new Expression.Literal('title'),
			new Expression.Literal('truthy'),
		])

		expect(Array.from(output.value)).toEqual([
			['item1', new Map([['title', 'Yo 1']])],
			['item3', new Map([['title', 'Yo 2']])],
		])
	})

	test('it can use the "not truthy" operator', () => {
		const record = new Expression.Literal(
			new Map([
				['item1', new Map([['title', 'Yo 1']])],
				['item2', new Map([['title', null]])],
				['item3', new Map([['title', 'Yo 2']])],
			]),
		)
		const callable = new FilterBy(record)

		const output = callable.call([
			new Expression.Literal('title'),
			new Expression.Literal('not truthy'),
		])

		expect(Array.from(output.value)).toEqual([
			['item2', new Map([['title', null]])],
		])
	})

	test('it can use the "exists" operator', () => {
		const record = new Expression.Literal(
			new Map([
				['item1', new Map([['title', 'Yo 1']])],
				['item2', new Map([])],
				['item3', new Map([['title', null]])],
			]),
		)
		const callable = new FilterBy(record)

		const output = callable.call([
			new Expression.Literal('title'),
			new Expression.Literal('exists'),
		])

		expect(Array.from(output.value)).toEqual([
			['item1', new Map([['title', 'Yo 1']])],
			['item3', new Map([['title', null]])],
		])
	})

	test('it can use the "not exists" operator', () => {
		const record = new Expression.Literal(
			new Map([
				['item1', new Map([['title', 'Yo 1']])],
				['item2', new Map([['random', 'yo']])],
				['item3', new Map([['title', null]])],
			]),
		)
		const callable = new FilterBy(record)

		const output = callable.call([
			new Expression.Literal('title'),
			new Expression.Literal('not exists'),
		])

		expect(Array.from(output.value)).toEqual([
			['item2', new Map([['random', 'yo']])],
		])
	})
})

describe('Errors', () => {
	test('it errors if the "field" is not a string', () => {
		const record = new Expression.Literal(
			new Map([
				['item1', new Map([['count', 2]])],
				['item2', new Map([['count', 1]])],
				['item3', new Map([['count', 3]])],
			]),
		)
		const callable = new FilterBy(record)
		const runner = () =>
			callable.call([
				new Expression.Literal(1),
				new Expression.Literal('equals'),
				new Expression.Literal(true),
			])

		expect(runner).toThrow(NonStringFieldInFilterFunction)
	})

	test('it errors if the operator is invalid', () => {
		const record = new Expression.Literal(
			new Map([
				['item1', new Map([['count', 2]])],
				['item2', new Map([['count', 1]])],
				['item3', new Map([['count', 3]])],
			]),
		)
		const callable = new FilterBy(record)
		const runner = () =>
			callable.call([
				new Expression.Literal('count'),
				new Expression.Literal('higher than'),
				new Expression.Literal(3),
			])

		expect(runner).toThrow(InvalidOperatorInFilterFunction)
	})

	test('it errors if using numeric operator on non-numbers', () => {
		const record = new Expression.Literal(
			new Map([
				['item1', new Map([['count', 'yo']])],
				['item2', new Map([['count', 1]])],
				['item3', new Map([['count', 3]])],
			]),
		)
		const callable = new FilterBy(record)
		const runner = () =>
			callable.call([
				new Expression.Literal('count'),
				new Expression.Literal('less than'),
				new Expression.Literal(3),
			])

		expect(runner).toThrow(InvalidNumberOperatorInFilterFunction)
	})

	test('it errors if using "contains" on non-strings', () => {
		const record = new Expression.Literal(
			new Map([
				['item1', new Map([['path', '/articles/1']])],
				['item2', new Map([['path', 1]])],
				['item3', new Map([['path', '/articles/3']])],
			]),
		)
		const callable = new FilterBy(record)
		const runner = () =>
			callable.call([
				new Expression.Literal('path'),
				new Expression.Literal('contains'),
				new Expression.Literal('articles'),
			])

		expect(runner).toThrow(InvalidContainsValueInFilterFunction)
	})
})
