import Callable from '@/expressions/functions/Callable'
import Expression from '@/expressions/Expression'

export default class KebabCase extends Callable {
	constructor(item) {
		super()
		this.item = item
	}

	name() {
		return 'kebabCase'
	}

	arity() {
		return [0]
	}

	call(args) {
		const output = this.item.value.replaceAll(' ', '-').toLowerCase()

		return new Expression.Literal(output)
	}
}
