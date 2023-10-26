import Callable from '@/expressions/functions/Callable'
import Expression from '@/expressions/Expression'

export default class PascalCase extends Callable {
	constructor(item) {
		super()
		this.item = item
	}

	name() {
		return 'pascalCase'
	}

	arity() {
		return [0]
	}

	call(args) {
		const output = this.item.value
			.split(' ')
			.map(piece => piece.charAt(0).toUpperCase() + piece.slice(1))
			.join('')

		return new Expression.Literal(output)
	}
}
