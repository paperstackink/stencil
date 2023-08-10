import Expression from '@/expressions/Expression'
import ToLowerCase from '@/expressions/methods/strings/ToLowerCase'

test('it converts the string to lower case', () => {
	const callable = new ToLowerCase(new Expression.Literal('YoYo'))
	const output = callable.call([])

	expect(output).toEqual(new Expression.Literal('yoyo'))
})
