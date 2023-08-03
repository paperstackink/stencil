import Debug from '@/expressions/functions/Debug'
import Expression from '@/expressions/Expression'

test('it prints a dummy message', () => {
	const callable = new Debug()
	const output = callable.call([])

	expect(output).toEqual(
		new Expression.Literal(
			"You called the 'debug' function. It hasn’t been implement yet, but it will be very soon!",
		),
	)
})
