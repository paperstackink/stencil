import Expression from '@/expressions/Expression'
import LowerCase from '@/expressions/methods/strings/LowerCase'

test('it converts the string to lower case', () => {
	const callable = new LowerCase(new Expression.Literal('YoYo'))
	const output = callable.call([])

	expect(output).toEqual(new Expression.Literal('yoyo'))
})
