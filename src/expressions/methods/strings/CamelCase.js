import Callable from '@/expressions/functions/Callable'
import Expression from '@/expressions/Expression'

export default class CamelCase extends Callable {
	constructor(item) {
		super()
		this.item = item
	}

	name() {
		return 'camelCase'
	}

	arity() {
		return [0]
	}

	call(args) {
		const output = this.item.value
			.split(' ')
			.map((piece, index) => {
				if (index === 0) {
					return piece.toLowerCase()
				}

				return (
					piece.charAt(0).toUpperCase() + piece.slice(1).toLowerCase()
				)
			})
			.join('')

		return new Expression.Literal(output)
	}
}
