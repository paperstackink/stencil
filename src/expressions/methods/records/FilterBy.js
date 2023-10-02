import Callable from '@/expressions/functions/Callable'
import Expression from '@/expressions/Expression'
import { cloneDeep } from 'lodash'
import { getType } from '@/expressions/helpers/getType'

import NonStringFieldInFilterBy from '@/expressions/errors/NonStringFieldInFilterBy'
import InvalidOperatorInFilterBy from '@/expressions/errors/InvalidOperatorInFilterBy'
import NonExistingFieldInFilterBy from '@/expressions/errors/NonExistingFieldInFilterBy'
import InvalidContainsValueInFilterBy from '@/expressions/errors/InvalidContainsValueInFilterBy'
import InvalidNumberOperatorInFilterBy from '@/expressions/errors/InvalidNumberOperatorInFilterBy'

export default class FilterBy extends Callable {
	constructor(record) {
		super()
		this.record = record
	}

	name() {
		return 'filterBy'
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
			throw new NonStringFieldInFilterBy(getType(field))
		}

		const operators = [
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
		]

		if (!operators.includes(operator)) {
			throw new InvalidOperatorInFilterBy(operator, operators)
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
				throw new InvalidNumberOperatorInFilterBy(
					operator,
					getType(map.get(field)),
					field,
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
				if (!map.has(field)) {
					throw new NonExistingFieldInFilterBy(field, value)
				}
				if (typeof map.get(field) !== 'string') {
					throw new InvalidContainsValueInFilterBy(
						getType(map.get(field)),
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
