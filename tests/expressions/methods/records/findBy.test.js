import FindBy from '@/expressions/methods/records/FindBy'
import Expression from '@/expressions/Expression'

import NonStringFieldInFilterFunction from '@/expressions/errors/NonStringFieldInFilterFunction'
import InvalidOperatorInFilterFunction from '@/expressions/errors/InvalidOperatorInFilterFunction'
import InvalidContainsValueInFilterFunction from '@/expressions/errors/InvalidContainsValueInFilterFunction'
import InvalidNumberOperatorInFilterFunction from '@/expressions/errors/InvalidNumberOperatorInFilterFunction'

describe('Functionality', () => {
	test('it finds the first record that matches', () => {
		const record = new Expression.Literal(
			new Map([
				[
					'item1',
					new Map([
						['matches', true],
						['id', 1],
					]),
				],
				[
					'item2',
					new Map([
						['matches', false],
						['id', 2],
					]),
				],
				[
					'item3',
					new Map([
						['matches', true],
						['id', 3],
					]),
				],
			]),
		)
		const callable = new FindBy(record)
		const output = callable.call([
			new Expression.Literal('matches'),
			new Expression.Literal('equals'),
			new Expression.Literal(true),
		])
		expect(Array.from(output.value)).toEqual([
			['matches', true],
			['id', 1],
		])
	})

	test("it returns null if there isn't a match", () => {
		const record = new Expression.Literal(
			new Map([
				[
					'item1',
					new Map([
						['matches', false],
						['id', 1],
					]),
				],
			]),
		)
		const callable = new FindBy(record)
		const output = callable.call([
			new Expression.Literal('matches'),
			new Expression.Literal('equals'),
			new Expression.Literal(true),
		])
		expect(output.value).toEqual(null)
	})

	test('it can find a subrecord even if there are non-record keys', () => {
		const record = new Expression.Literal(
			new Map([
				['isPage', true],
				[
					'item2',
					new Map([
						['matches', false],
						['id', 2],
					]),
				],
				[
					'item3',
					new Map([
						['matches', true],
						['id', 3],
					]),
				],
			]),
		)
		const callable = new FindBy(record)
		const output = callable.call([
			new Expression.Literal('matches'),
			new Expression.Literal('equals'),
			new Expression.Literal(true),
		])
		expect(Array.from(output.value)).toEqual([
			['matches', true],
			['id', 3],
		])
	})

	test('it uses the equals operator if an operator argument is not provided', () => {
		const record = new Expression.Literal(
			new Map([
				[
					'item1',
					new Map([
						['matches', true],
						['id', 1],
					]),
				],
				[
					'item2',
					new Map([
						['matches', false],
						['id', 2],
					]),
				],
				[
					'item3',
					new Map([
						['matches', true],
						['id', 3],
					]),
				],
			]),
		)
		const callable = new FindBy(record)
		const output = callable.call([
			new Expression.Literal('matches'),
			new Expression.Literal(true),
		])
		expect(Array.from(output.value)).toEqual([
			['matches', true],
			['id', 1],
		])
	})

	test('it assumes the value should be truthy if omitting the value', () => {
		const record = new Expression.Literal(
			new Map([
				[
					'item1',
					new Map([
						['title', 'Yo 1'],
						['id', 1],
					]),
				],
				[
					'item2',
					new Map([
						['title', null],
						['id', 2],
					]),
				],
				[
					'item3',
					new Map([
						['title', 'Yo 2'],
						['id', 3],
					]),
				],
			]),
		)
		const callable = new FindBy(record)
		const output = callable.call([new Expression.Literal('title')])
		expect(Array.from(output.value)).toEqual([
			['title', 'Yo 1'],
			['id', 1],
		])
	})
})

describe('Operators', () => {
	test('it can use the "equals" operator', () => {
		const record = new Expression.Literal(
			new Map([
				[
					'item1',
					new Map([
						['matches', true],
						['id', 1],
					]),
				],
				[
					'item2',
					new Map([
						['matches', false],
						['id', 2],
					]),
				],
				[
					'item3',
					new Map([
						['matches', true],
						['id', 3],
					]),
				],
			]),
		)
		const callable = new FindBy(record)
		const output = callable.call([
			new Expression.Literal('matches'),
			new Expression.Literal('equals'),
			new Expression.Literal(true),
		])
		expect(Array.from(output.value)).toEqual([
			['matches', true],
			['id', 1],
		])
	})

	test('it can use the "not equals" operator', () => {
		const record = new Expression.Literal(
			new Map([
				[
					'item1',
					new Map([
						['matches', true],
						['id', 1],
					]),
				],
				[
					'item2',
					new Map([
						['matches', false],
						['id', 2],
					]),
				],
				[
					'item3',
					new Map([
						['matches', true],
						['id', 3],
					]),
				],
			]),
		)
		const callable = new FindBy(record)
		const output = callable.call([
			new Expression.Literal('matches'),
			new Expression.Literal('not equals'),
			new Expression.Literal(true),
		])
		expect(Array.from(output.value)).toEqual([
			['matches', false],
			['id', 2],
		])
	})

	test('it can use the "greater than" operator', () => {
		const record = new Expression.Literal(
			new Map([
				[
					'item1',
					new Map([
						['count', 2],
						['id', 1],
					]),
				],
				[
					'item2',
					new Map([
						['count', 3],
						['id', 2],
					]),
				],
				[
					'item3',
					new Map([
						['count', 4],
						['id', 3],
					]),
				],
			]),
		)
		const callable = new FindBy(record)
		const output = callable.call([
			new Expression.Literal('count'),
			new Expression.Literal('greater than'),
			new Expression.Literal(3),
		])
		expect(Array.from(output.value)).toEqual([
			['count', 4],
			['id', 3],
		])
	})

	test('it can use the "greater than or equals" operator', () => {
		const record = new Expression.Literal(
			new Map([
				[
					'item1',
					new Map([
						['count', 2],
						['id', 1],
					]),
				],
				[
					'item2',
					new Map([
						['count', 3],
						['id', 2],
					]),
				],
				[
					'item3',
					new Map([
						['count', 4],
						['id', 3],
					]),
				],
			]),
		)
		const callable = new FindBy(record)
		const output = callable.call([
			new Expression.Literal('count'),
			new Expression.Literal('greater than or equals'),
			new Expression.Literal(3),
		])
		expect(Array.from(output.value)).toEqual([
			['count', 3],
			['id', 2],
		])
	})

	test('it can use the "less than" operator', () => {
		const record = new Expression.Literal(
			new Map([
				[
					'item1',
					new Map([
						['count', 2],
						['id', 1],
					]),
				],
				[
					'item2',
					new Map([
						['count', 3],
						['id', 2],
					]),
				],
				[
					'item3',
					new Map([
						['count', 4],
						['id', 3],
					]),
				],
			]),
		)
		const callable = new FindBy(record)
		const output = callable.call([
			new Expression.Literal('count'),
			new Expression.Literal('less than'),
			new Expression.Literal(3),
		])
		expect(Array.from(output.value)).toEqual([
			['count', 2],
			['id', 1],
		])
	})

	test('it can use the "less than or equals" operator', () => {
		const record = new Expression.Literal(
			new Map([
				[
					'item1',
					new Map([
						['count', 2],
						['id', 1],
					]),
				],
				[
					'item2',
					new Map([
						['count', 3],
						['id', 2],
					]),
				],
				[
					'item3',
					new Map([
						['count', 4],
						['id', 3],
					]),
				],
			]),
		)
		const callable = new FindBy(record)
		const output = callable.call([
			new Expression.Literal('count'),
			new Expression.Literal('less than or equals'),
			new Expression.Literal(3),
		])
		expect(Array.from(output.value)).toEqual([
			['count', 2],
			['id', 1],
		])
	})

	test('it can use the "contains" operator', () => {
		const record = new Expression.Literal(
			new Map([
				[
					'item1',
					new Map([
						['path', '/articles/1'],
						['id', 1],
					]),
				],
				[
					'item2',
					new Map([
						['path', '/links/2'],
						['id', 2],
					]),
				],
				[
					'item3',
					new Map([
						['path', '/articles/3'],
						['id', 3],
					]),
				],
			]),
		)
		const callable = new FindBy(record)
		const output = callable.call([
			new Expression.Literal('path'),
			new Expression.Literal('contains'),
			new Expression.Literal('articles'),
		])
		expect(Array.from(output.value)).toEqual([
			['path', '/articles/1'],
			['id', 1],
		])
	})

	test('it can use the "truthy" operator', () => {
		const record = new Expression.Literal(
			new Map([
				[
					'item1',
					new Map([
						['title', 'Yo 1'],
						['id', 1],
					]),
				],
				[
					'item2',
					new Map([
						['title', null],
						['id', 2],
					]),
				],
				[
					'item3',
					new Map([
						['title', 'Yo 2'],
						['id', 3],
					]),
				],
			]),
		)
		const callable = new FindBy(record)
		const output = callable.call([
			new Expression.Literal('title'),
			new Expression.Literal('truthy'),
		])
		expect(Array.from(output.value)).toEqual([
			['title', 'Yo 1'],
			['id', 1],
		])
	})

	test('it can use the "not truthy" operator', () => {
		const record = new Expression.Literal(
			new Map([
				[
					'item1',
					new Map([
						['title', 'Yo 1'],
						['id', 1],
					]),
				],
				[
					'item2',
					new Map([
						['title', null],
						['id', 2],
					]),
				],
				[
					'item3',
					new Map([
						['title', 'Yo 2'],
						['id', 3],
					]),
				],
			]),
		)
		const callable = new FindBy(record)
		const output = callable.call([
			new Expression.Literal('title'),
			new Expression.Literal('not truthy'),
		])
		expect(Array.from(output.value)).toEqual([
			['title', null],
			['id', 2],
		])
	})

	test('it can use the "exists" operator', () => {
		const record = new Expression.Literal(
			new Map([
				[
					'item1',
					new Map([
						['title', 'Yo 1'],
						['id', 1],
					]),
				],
				['item2', new Map([['id', 2]])],
				[
					'item3',
					new Map([
						['title', 'Yo 2'],
						['id', 3],
					]),
				],
			]),
		)
		const callable = new FindBy(record)
		const output = callable.call([
			new Expression.Literal('title'),
			new Expression.Literal('exists'),
		])
		expect(Array.from(output.value)).toEqual([
			['title', 'Yo 1'],
			['id', 1],
		])
	})

	test('it can use the "not exists" operator', () => {
		const record = new Expression.Literal(
			new Map([
				[
					'item1',
					new Map([
						['title', 'Yo 1'],
						['id', 1],
					]),
				],
				['item2', new Map([['id', 2]])],
				[
					'item3',
					new Map([
						['title', 'Yo 2'],
						['id', 3],
					]),
				],
			]),
		)
		const callable = new FindBy(record)
		const output = callable.call([
			new Expression.Literal('title'),
			new Expression.Literal('not exists'),
		])
		expect(Array.from(output.value)).toEqual([['id', 2]])
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
		const callable = new FindBy(record)
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
		const callable = new FindBy(record)
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
		const callable = new FindBy(record)
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
				['item1', new Map([['path', 1]])],
				['item2', new Map([['path', '/articles/1']])],
				['item3', new Map([['path', '/articles/3']])],
			]),
		)
		const callable = new FindBy(record)
		const runner = () =>
			callable.call([
				new Expression.Literal('path'),
				new Expression.Literal('contains'),
				new Expression.Literal('articles'),
			])
		expect(runner).toThrow(InvalidContainsValueInFilterFunction)
	})
})
