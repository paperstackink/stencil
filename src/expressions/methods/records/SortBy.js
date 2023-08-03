import Callable from '@/expressions/functions/Callable'
import Expression from '@/expressions/Expression'
import RuntimeError from '@/expressions/errors/RuntimeError'

export default class SortBy extends Callable {
	constructor(record) {
		super()
		this.record = record
	}

	arity() {
		return 2
	}

	call(args) {
		const sortKey = args[0].value
		const providedDirection = args[1].value

		if (typeof sortKey !== 'string') {
			throw new RuntimeError('The sort key must be a string.')
		}

		if (typeof providedDirection !== 'string') {
			throw new RuntimeError(
				"The direction must be either 'ascending' or 'descending'.",
			)
		}

		let direction
		if (['asc', 'ascending'].includes(providedDirection.toLowerCase())) {
			direction = 'ascending'
		} else if (
			['desc', 'descending'].includes(providedDirection.toLowerCase())
		) {
			direction = 'descending'
		} else {
			throw new RuntimeError(
				"The direction must be either 'ascending' or 'descending'.",
			)
		}

		const entries = Array.from(this.record.value).sort((a, b) => {
			const keyA = a[0]
			const valueA = a[1]
			const keyB = b[0]
			const valueB = b[1]

			if (!(valueA instanceof Map) || !(valueB instanceof Map)) {
				throw new RuntimeError(`You must sort a record of records.`)
			}

			if (typeof valueA.get(sortKey) !== typeof valueB.get(sortKey)) {
				const first = getType(valueB.get(sortKey))
				const last = getType(valueA.get(sortKey))

				throw new RuntimeError(
					`You must sort items by the same data type. Sorted '${first}' and '${last}'.`,
				)
			}

			if (valueA.get(sortKey) < valueB.get(sortKey)) {
				return direction === 'ascending' ? -1 : 1
			}

			if (valueA.get(sortKey) > valueB.get(sortKey)) {
				return direction === 'ascending' ? 1 : -1
			}

			return 0
		})

		return new Expression.Literal(new Map(entries))
	}
}

function getType(value) {
	if (value instanceof Map) {
		return 'record'
	}

	return typeof value
}
