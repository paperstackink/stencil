import Callable from '@/expressions/functions/Callable'
import Expression from '@/expressions/Expression'

export default class ToLowerCase extends Callable {
	constructor(item) {
		super()
		this.item = item
	}

	arity() {
		return 0
	}

	call(args) {
		return new Expression.Literal(this.item.value.toLowerCase())
	}
}
