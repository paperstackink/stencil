import Expression from '@/expressions/Expression'

import CamelCase from '@/expressions/methods/strings/CamelCase'
import KebabCase from '@/expressions/methods/strings/KebabCase'
import LowerCase from '@/expressions/methods/strings/LowerCase'
import UpperCase from '@/expressions/methods/strings/UpperCase'
import SnakeCase from '@/expressions/methods/strings/SnakeCase'
import TitleCase from '@/expressions/methods/strings/TitleCase'
import PascalCase from '@/expressions/methods/strings/PascalCase'
import SentenceCase from '@/expressions/methods/strings/SentenceCase'

test('it converts the string to lower case', () => {
	const callable = new LowerCase(new Expression.Literal('YoYo'))
	const output = callable.call([])

	expect(output).toEqual(new Expression.Literal('yoyo'))
})

test('it converts the string to uppercase', () => {
	const callable = new UpperCase(new Expression.Literal('YoYo'))
	const output = callable.call([])

	expect(output).toEqual(new Expression.Literal('YOYO'))
})

test('it converts the string to title case', () => {
	const callable = new TitleCase(
		new Expression.Literal("I'm in the-house across from_here with A tv"),
	)
	const output = callable.call([])

	expect(output).toEqual(
		new Expression.Literal("I'm in the House Across from Here with a TV"),
	)
})

test('it converts the string to sentence case', () => {
	const callable = new SentenceCase(
		new Expression.Literal('I’m in the House Across From Here'),
	)
	const output = callable.call([])

	expect(output).toEqual(
		new Expression.Literal('I’m in the house across from here'),
	)
})

test('it converts the string to camel case', () => {
	const callable = new CamelCase(new Expression.Literal('A variable name'))
	const output = callable.call([])

	expect(output).toEqual(new Expression.Literal('aVariableName'))
})

test('it converts the string to kebab case', () => {
	const callable = new KebabCase(new Expression.Literal('A variable name'))
	const output = callable.call([])

	expect(output).toEqual(new Expression.Literal('a-variable-name'))
})

test('it converts the string to pascal case', () => {
	const callable = new PascalCase(new Expression.Literal('A variable name'))
	const output = callable.call([])

	expect(output).toEqual(new Expression.Literal('AVariableName'))
})

test('it converts the string to snake case', () => {
	const callable = new SnakeCase(new Expression.Literal('A variable name'))
	const output = callable.call([])

	expect(output).toEqual(new Expression.Literal('a_variable_name'))
})
