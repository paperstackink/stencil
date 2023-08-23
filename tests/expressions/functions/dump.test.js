import Dump from '@/expressions/functions/Dump'
import Expression from '@/expressions/Expression'

test('X', async () => {
	const callable = new Dump()
	const output = await callable.call([
		new Expression.Literal(321),
		// 123,
		// false,
		// new Map([
		// 	['item 1', 'Item 1'],
		// 	['item 2', 'Item 2'],
		// ]),
	])

	expect(output).toEqual(
		new Expression.Literal(
			"You called the 'debug' function. It hasn’t been implement yet, but it will be very soon!",
		),
	)
})

test.todo('it resolves an expression before dumping it')
