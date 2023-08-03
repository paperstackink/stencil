import Debug from '@/expressions/functions/Debug'
import Parser from '@/expressions/Parser'
import Tokenizer from '@/expressions/Tokenizer'
import Expression from '@/expressions/Expression'
import Interpreter from '@/expressions/Interpreter'

test('it prints a dummy message', () => {
	const input = `debug()`
	const tokenizer = new Tokenizer(input)
	const tokens = tokenizer.scanTokens()
	const parser = new Parser(tokens)
	const ast = parser.parse()
	const interpreter = new Interpreter(ast, {
		debug: new Debug(),
	})
	const output = interpreter.interpret()

	expect(output).toEqual(
		new Expression.Literal(
			"You called the 'debug' function. It hasn’t been implement yet, but it will be very soon!",
		),
	)
})
