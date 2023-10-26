import Callable from '@/expressions/functions/Callable'
import Expression from '@/expressions/Expression'

export default class UpperCase extends Callable {
	constructor(item) {
		super()
		this.item = item
	}

	name() {
		return 'upperCase'
	}

	arity() {
		return [0]
	}

	call(args) {
		return new Expression.Literal(this.item.value.toUpperCase())
	}
}
