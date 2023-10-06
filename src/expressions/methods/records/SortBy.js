import Callable from '@/expressions/functions/Callable'
import Expression from '@/expressions/Expression'

import { getType } from '@/expressions/helpers/getType'

import NonStringSortKeyInSortBy from '@/expressions/errors/NonStringSortKeyInSortBy'
import SortingNonRecordsInSortBy from '@/expressions/errors/SortingNonRecordsInSortBy'
import InvalidSortDirectionInSortBy from '@/expressions/errors/InvalidSortDirectionInSortBy'
import SortingMismatchedTypesInSortBy from '@/expressions/errors/SortingMismatchedTypesInSortBy'

export default class SortBy extends Callable {
	constructor(record) {
		super()
		this.record = record
	}

	name() {
		return 'sortBy'
	}

	arity() {
		return [1, 2]
	}

	call(args) {
		const sortKey = args[0].value
		const providedDirection =
			args.length === 2 ? args[1].value : 'ascending'

		if (typeof sortKey !== 'string') {
			throw new NonStringSortKeyInSortBy(getType(sortKey))
		}

		if (typeof providedDirection !== 'string') {
			throw new InvalidSortDirectionInSortBy(providedDirection)
		}

		let direction
		if (['asc', 'ascending'].includes(providedDirection.toLowerCase())) {
			direction = 'ascending'
		} else if (
			['desc', 'descending'].includes(providedDirection.toLowerCase())
		) {
			direction = 'descending'
		} else {
			throw new InvalidSortDirectionInSortBy(providedDirection)
		}

		const entries = Array.from(this.record.value).sort((a, b) => {
			const keyA = a[0]
			const valueA = a[1]
			const keyB = b[0]
			const valueB = b[1]

			if (!(valueA instanceof Map)) {
				throw new SortingNonRecordsInSortBy(
					getType(valueA),
					valueA,
					keyA,
				)
			}

			if (!(valueB instanceof Map)) {
				throw new SortingNonRecordsInSortBy(
					getType(valueB),
					valueB,
					keyB,
				)
			}

			if (typeof valueA.get(sortKey) !== typeof valueB.get(sortKey)) {
				throw new SortingMismatchedTypesInSortBy(
					sortKey,
					valueB.get(sortKey),
					getType(valueB.get(sortKey)),
					valueA.get(sortKey),
					getType(valueA.get(sortKey)),
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
