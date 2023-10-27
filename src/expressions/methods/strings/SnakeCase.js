import Callable from '@/expressions/functions/Callable'
import Expression from '@/expressions/Expression'

export default class SnakeCase extends Callable {
	constructor(item) {
		super()
		this.item = item
	}

	name() {
		return 'snakeCase'
	}

	arity() {
		return [0]
	}

	call(args) {
		const output = this.item.value
			.replace(/[A-Z]/g, letter => letter.toLowerCase())
			.replaceAll(' ', '_')

		return new Expression.Literal(output)
	}
}
