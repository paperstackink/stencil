import Callable from '@/expressions/functions/Callable'
import Expression from '@/expressions/Expression'

export default class LowerCase extends Callable {
	constructor(item) {
		super()
		this.item = item
	}

	name() {
		return 'lowerCase'
	}

	arity() {
		return [0]
	}

	call(args) {
		return new Expression.Literal(this.item.value.toLowerCase())
	}
}
