import Callable from '@/expressions/functions/Callable'
import Expression from '@/expressions/Expression'
import RuntimeError from '@/expressions/errors/RuntimeError'
import { cloneDeep } from 'lodash'

export default class FilterBy extends Callable {
	constructor(record) {
		super()
		this.record = record
	}

	arity() {
		return [1, 2, 3]
	}

	call(args) {
		let field
		let operator
		let value

		if (args.length === 3) {
			field = args[0].value
			operator = args[1].value
			value = args[2].value
		} else if (
			args.length === 2 &&
			!['truthy', 'not truthy', 'exists', 'not exists'].includes(
				args[1].value,
			)
		) {
			field = args[0].value
			operator = 'equals'
			value = args[1].value
		} else if (args.length === 2) {
			field = args[0].value
			operator = args[1].value
		} else {
			field = args[0].value
			operator = 'truthy'
		}

		if (typeof field !== 'string') {
			throw new RuntimeError('The field must be a string.')
		}

		if (
			![
				'equals',
				'not equals',
				'greater than',
				'greater than or equals',
				'less than',
				'less than or equals',
				'contains',
				'truthy',
				'not truthy',
				'exists',
				'not exists',
			].includes(operator)
		) {
			throw new RuntimeError('Invalid operator.')
		}

		const record = cloneDeep(this.record.value)

		record.forEach((map, key) => {
			if (
				[
					'less than',
					'less than or equals',
					'greater than',
					'greater than or equals',
				].includes(operator) &&
				typeof map.get(field) !== 'number'
			) {
				throw new RuntimeError(
					`Cannot filter by "${operator}" on type "${getType(
						map.get(field),
					)}"`,
				)
			}

			if (operator === 'equals') {
				if (map.get(field) !== value) {
					record.delete(key)
				}
			}

			if (operator === 'not equals') {
				if (map.get(field) === value) {
					record.delete(key)
				}
			}

			if (operator === 'greater than') {
				if (map.get(field) <= value) {
					record.delete(key)
				}
			}

			if (operator === 'greater than or equals') {
				if (map.get(field) < value) {
					record.delete(key)
				}
			}

			if (operator === 'less than') {
				if (map.get(field) >= value) {
					record.delete(key)
				}
			}

			if (operator === 'less than or equals') {
				if (map.get(field) > value) {
					record.delete(key)
				}
			}

			if (operator === 'contains') {
				if (typeof map.get(field) !== 'string') {
					throw new RuntimeError(
						`Cannot filter by "contains" on type "${getType(
							map.get(field),
						)}"`,
					)
				}
				if (!map.get(field).includes(value)) {
					record.delete(key)
				}
			}

			if (operator === 'truthy') {
				if (!map.get(field)) {
					record.delete(key)
				}
			}

			if (operator === 'not truthy') {
				if (map.get(field)) {
					record.delete(key)
				}
			}

			if (operator === 'exists') {
				if (!map.has(field)) {
					record.delete(key)
				}
			}

			if (operator === 'not exists') {
				if (map.has(field)) {
					record.delete(key)
				}
			}
		})

		return new Expression.Literal(record)
	}
}

function getType(value) {
	if (value instanceof Map) {
		return 'record'
	}

	return typeof value
}
