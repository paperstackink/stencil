import Callable from '@/expressions/functions/Callable'
import Expression from '@/expressions/Expression'
import { getType } from '@/expressions/helpers/getType'

import NonStringFieldInFilterFunction from '@/expressions/errors/NonStringFieldInFilterFunction'
import InvalidOperatorInFilterFunction from '@/expressions/errors/InvalidOperatorInFilterFunction'
import NonExistingFieldInFilterFunction from '@/expressions/errors/NonExistingFieldInFilterFunction'
import InvalidContainsValueInFilterFunction from '@/expressions/errors/InvalidContainsValueInFilterFunction'
import InvalidNumberOperatorInFilterFunction from '@/expressions/errors/InvalidNumberOperatorInFilterFunction'

export default class FindBy extends Callable {
	constructor(record) {
		super()
		this.record = record
	}

	name() {
		return 'findBy'
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
			throw new NonStringFieldInFilterFunction('findBy', getType(field))
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
			throw new InvalidOperatorInFilterFunction(
				'findBy',
				operator,
				operators,
			)
		}

		let returnValue = null
		let hasResolved = false

		this.record.value.forEach((map, key) => {
			if (hasResolved) {
				return
			}

			if (!(map instanceof Map)) {
				return
			}

			if (
				[
					'less than',
					'less than or equals',
					'greater than',
					'greater than or equals',
				].includes(operator) &&
				typeof map.get(field) !== 'number'
			) {
				throw new InvalidNumberOperatorInFilterFunction(
					'findBy',
					operator,
					getType(map.get(field)),
					field,
				)
			}

			if (operator === 'equals') {
				if (map.get(field) === value) {
					hasResolved = true
					returnValue = map
				}
			}

			if (operator === 'not equals') {
				if (map.get(field) !== value) {
					hasResolved = true
					returnValue = map
				}
			}

			if (operator === 'greater than') {
				if (map.get(field) > value) {
					hasResolved = true
					returnValue = map
				}
			}

			if (operator === 'greater than or equals') {
				if (map.get(field) >= value) {
					hasResolved = true
					returnValue = map
				}
			}

			if (operator === 'less than') {
				if (map.get(field) < value) {
					hasResolved = true
					returnValue = map
				}
			}

			if (operator === 'less than or equals') {
				if (map.get(field) <= value) {
					hasResolved = true
					returnValue = map
				}
			}

			if (operator === 'contains') {
				console.log('!!!!!!!!!!!!!!!!', field, map.get(field))
				if (!map.has(field)) {
					throw new NonExistingFieldInFilterFunction(
						'findBy',
						field,
						value,
					)
				}
				if (typeof map.get(field) !== 'string') {
					throw new InvalidContainsValueInFilterFunction(
						'findBy',
						getType(map.get(field)),
					)
				}
				if (map.get(field).includes(value)) {
					hasResolved = true
					returnValue = map
				}
			}

			if (operator === 'truthy') {
				if (map.get(field)) {
					hasResolved = true
					returnValue = map
				}
			}

			if (operator === 'not truthy') {
				if (!map.get(field)) {
					hasResolved = true
					returnValue = map
				}
			}

			if (operator === 'exists') {
				if (map.has(field)) {
					hasResolved = true
					returnValue = map
				}
			}

			if (operator === 'not exists') {
				if (!map.has(field)) {
					hasResolved = true
					returnValue = map
				}
			}
		})

		return new Expression.Literal(returnValue)
	}
}
