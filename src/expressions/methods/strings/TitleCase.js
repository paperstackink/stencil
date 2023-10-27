import Callable from '@/expressions/functions/Callable'
import Expression from '@/expressions/Expression'

const lowers = [
	'a',
	'an',
	'the',
	'and',
	'but',
	'or',
	'for',
	'nor',
	'as',
	'at',
	'by',
	'for',
	'from',
	'in',
	'into',
	'near',
	'of',
	'on',
	'onto',
	'to',
	'with',
]

const uppers = ['id', 'tv']

export default class TitleCase extends Callable {
	constructor(item) {
		super()
		this.item = item
	}

	name() {
		return 'titleCase'
	}

	arity() {
		return [0]
	}

	call(args) {
		const output = this.item.value
			.replaceAll('-', ' ')
			.replaceAll('_', ' ')
			.split(' ')
			.map(piece => {
				if (uppers.includes(piece.toLowerCase())) {
					return piece.toUpperCase()
				}

				if (lowers.includes(piece.toLowerCase())) {
					return piece.toLowerCase()
				}

				return (
					piece.charAt(0).toUpperCase() + piece.slice(1).toLowerCase()
				)
			})
			.join(' ')

		return new Expression.Literal(output)
	}
}
