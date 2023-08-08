import Callable from '@/expressions/functions/Callable'
import Expression from '@/expressions/Expression'

export default class Debug extends Callable {
	arity() {
		return Infinity
	}

	call(interpreter, args) {
		return new Expression.Literal(
			"You called the 'debug' function. It hasn’t been implement yet, but it will be very soon!",
		)
	}
}
