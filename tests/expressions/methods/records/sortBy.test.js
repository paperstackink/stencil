import RuntimeError from '@/expressions/errors/RuntimeError'
import Expression from '@/expressions/Expression'
import SortBy from '@/expressions/methods/records/SortBy'

describe('Strings', () => {
	test('it can sort strings in ascending order', () => {
		const record = new Expression.Literal(
			new Map([
				['item1', new Map([['name', 'B']])],
				['item2', new Map([['name', 'A']])],
				['item3', new Map([['name', 'C']])],
			]),
		)
		const callable = new SortBy(record)

		const output = callable.call([
			new Expression.Literal('name'),
			new Expression.Literal('asc'),
		])

		expect(Array.from(output.value)).toEqual([
			['item2', new Map([['name', 'A']])],
			['item1', new Map([['name', 'B']])],
			['item3', new Map([['name', 'C']])],
		])
	})

	test('it can sort strings in descending order', () => {
		const record = new Expression.Literal(
			new Map([
				['item1', new Map([['name', 'B']])],
				['item2', new Map([['name', 'A']])],
				['item3', new Map([['name', 'C']])],
			]),
		)
		const callable = new SortBy(record)
		const output = callable.call([
			new Expression.Literal('name'),
			new Expression.Literal('desc'),
		])

		expect(Array.from(output.value)).toEqual([
			['item3', new Map([['name', 'C']])],
			['item1', new Map([['name', 'B']])],
			['item2', new Map([['name', 'A']])],
		])
	})
})

describe('Numbers', () => {
	test('it can sort by numbers in ascending order', () => {
		const record = new Expression.Literal(
			new Map([
				['item1', new Map([['count', 2]])],
				['item2', new Map([['count', 1]])],
				['item3', new Map([['count', 3]])],
			]),
		)
		const callable = new SortBy(record)
		const output = callable.call([
			new Expression.Literal('count'),
			new Expression.Literal('asc'),
		])

		expect(Array.from(output.value)).toEqual([
			['item2', new Map([['count', 1]])],
			['item1', new Map([['count', 2]])],
			['item3', new Map([['count', 3]])],
		])
	})

	test('it can sort by numbers in descending order', () => {
		const record = new Expression.Literal(
			new Map([
				['item1', new Map([['count', 2]])],
				['item2', new Map([['count', 1]])],
				['item3', new Map([['count', 3]])],
			]),
		)
		const callable = new SortBy(record)
		const output = callable.call([
			new Expression.Literal('count'),
			new Expression.Literal('desc'),
		])

		expect(Array.from(output.value)).toEqual([
			['item3', new Map([['count', 3]])],
			['item1', new Map([['count', 2]])],
			['item2', new Map([['count', 1]])],
		])
	})
})

describe('Dates', () => {
	test('it can sort by dates in ascending order', () => {
		const date2001 = new Date().setFullYear(2001)
		const date2002 = new Date().setFullYear(2002)
		const date2003 = new Date().setFullYear(2003)

		const record = new Expression.Literal(
			new Map([
				['item1', new Map([['date', date2002]])],
				['item2', new Map([['date', date2001]])],
				['item3', new Map([['date', date2003]])],
			]),
		)
		const callable = new SortBy(record)
		const output = callable.call([
			new Expression.Literal('date'),
			new Expression.Literal('asc'),
		])

		expect(Array.from(output.value)).toEqual([
			['item2', new Map([['date', date2001]])],
			['item1', new Map([['date', date2002]])],
			['item3', new Map([['date', date2003]])],
		])
	})

	test('it can sort by dates in descending order', () => {
		const date2001 = new Date().setFullYear(2001)
		const date2002 = new Date().setFullYear(2002)
		const date2003 = new Date().setFullYear(2003)

		const record = new Expression.Literal(
			new Map([
				['item1', new Map([['date', date2002]])],
				['item2', new Map([['date', date2001]])],
				['item3', new Map([['date', date2003]])],
			]),
		)
		const callable = new SortBy(record)
		const output = callable.call([
			new Expression.Literal('date'),
			new Expression.Literal('desc'),
		])

		expect(Array.from(output.value)).toEqual([
			['item3', new Map([['date', date2003]])],
			['item1', new Map([['date', date2002]])],
			['item2', new Map([['date', date2001]])],
		])
	})
})

describe('Errors', () => {
	test('it errors if the sortKey is not a string', () => {
		const record = new Expression.Literal(
			new Map([
				['item1', new Map([['count', 2]])],
				['item2', new Map([['count', 1]])],
				['item3', new Map([['count', 3]])],
			]),
		)
		const callable = new SortBy(record)
		const runner = () =>
			callable.call([
				new Expression.Literal(1),
				new Expression.Literal('desc'),
			])

		expect(runner).toThrow(
			new RuntimeError('The sort key must be a string.'),
		)
	})

	test('it errors if the direction is not a string', () => {
		const record = new Expression.Literal(
			new Map([
				['item1', new Map([['count', 2]])],
				['item2', new Map([['count', 1]])],
				['item3', new Map([['count', 3]])],
			]),
		)
		const callable = new SortBy(record)
		const runner = () =>
			callable.call([
				new Expression.Literal('count'),
				new Expression.Literal(2),
			])

		expect(runner).toThrow(
			new RuntimeError(
				"The direction must be either 'ascending' or 'descending'.",
			),
		)
	})

	test('it errors if the direction is a random string', () => {
		const record = new Expression.Literal(
			new Map([
				['item1', new Map([['count', 2]])],
				['item2', new Map([['count', 1]])],
				['item3', new Map([['count', 3]])],
			]),
		)
		const callable = new SortBy(record)
		const runner = () =>
			callable.call([
				new Expression.Literal('count'),
				new Expression.Literal('yo'),
			])

		expect(runner).toThrow(
			new RuntimeError(
				"The direction must be either 'ascending' or 'descending'.",
			),
		)
	})

	test('it errors if its sorting values of different data types', () => {
		const record = new Expression.Literal(
			new Map([
				['item1', new Map([['count', 2]])],
				['item2', new Map([['count', new Map([])]])],
				['item3', new Map([['count', 3]])],
			]),
		)
		const callable = new SortBy(record)
		const runner = () =>
			callable.call([
				new Expression.Literal('count'),
				new Expression.Literal('asc'),
			])

		expect(runner).toThrow(
			new RuntimeError(
				"You must sort items by the same data type. Sorted 'number' and 'record'.",
			),
		)
	})

	test('it errors if not sorting a record of records', () => {
		const record = new Expression.Literal(
			new Map([
				['item1', 'Value 1'],
				['item2', 'Value 2'],
				['item3', 'Value 3'],
			]),
		)
		const callable = new SortBy(record)
		const runner = () =>
			callable.call([
				new Expression.Literal('count'),
				new Expression.Literal('asc'),
			])

		expect(runner).toThrow(
			new RuntimeError('You must sort a record of records.'),
		)
	})
})
