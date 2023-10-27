import Callable from '@/expressions/functions/Callable'
import Expression from '@/expressions/Expression'

export default class SentenceCase extends Callable {
	constructor(item) {
		super()
		this.item = item
	}

	name() {
		return 'sentenceCase'
	}

	arity() {
		return [0]
	}

	call(args) {
		const output =
			this.item.value.charAt(0).toUpperCase() +
			this.item.value.slice(1).toLowerCase()

		return new Expression.Literal(output)
	}
}
