import Callable from '@/expressions/functions/Callable'
import Expression from '@/expressions/Expression'
import { v4 as uuid } from 'uuid'
import fs from 'node:fs/promises'
import path from 'path'
import { compile } from '@/index'
import DumpSignal from '@/dumping/DumpSignal'
import UnknownComponentNameError from '@/errors/UnknownComponentNameError'
import { isPlainObject } from 'lodash'

function getKey() {
	return `key-${uuid()}`
}

Map.prototype.merge = function (merged) {
	merged.forEach((value, key) => {
		this.set(key, value)
	})

	return this
}

Map.fromObject = object => {
	let entries = Object.entries(object)

	entries = entries.map(entry => {
		if (!isPlainObject(entry[1])) {
			return entry
		}

		return [entry[0], Map.fromObject(entry[1])]
	})

	return new Map(entries)
}

function getEntry(value, key) {
	if (typeof value === 'string') {
		if (!key) {
			return Map.fromObject({
				[getKey()]: {
					type: 'RootString',
					attributes: {
						value: value,
						level: getKey(),
						children: {
							[getKey()]: {
								type: 'EntryFunction',
								attributes: {
									key: 'lowerCase()',
									value: '() => String',
									description:
										'Converts the string to lower case',
								},
							},
						},
					},
				},
			})
		} else {
			return Map.fromObject({
				type: 'EntryString',
				attributes: {
					key,
					value,
					level: getKey(),
					children: {
						[getKey()]: {
							type: 'EntryFunction',
							attributes: {
								key: 'lowerCase()',
								value: '() => String',
								description:
									'Converts the string to lower case',
							},
						},
					},
				},
			})
		}
	}

	if (
		typeof value === 'number' ||
		typeof value === 'boolean' ||
		value instanceof Date
	) {
		if (!key) {
			return Map.fromObject({
				[getKey()]: {
					type: 'Literal',
					attributes: {
						value: value,
					},
				},
			})
		} else {
			return Map.fromObject({
				type: 'EntryLiteral',
				attributes: {
					key,
					value,
				},
			})
		}
	}

	if (value instanceof Map) {
		if (!key) {
			const children = {}

			value.forEach((value, key) => {
				children[getKey()] = getEntry(value, key)
			})

			return Map.fromObject({
				[getKey()]: {
					type: 'RootRecord',
					attributes: {
						level: getKey(),
						length: value.size,
						children,
					},
				},
			})
		} else {
			const children = {}

			value.forEach((value, key) => {
				children[getKey()] = getEntry(value, key)
			})

			return Map.fromObject({
				type: 'EntryRecord',
				attributes: {
					key,
					length: value.size,
					level: getKey(),
					children,
					more: {
						[getKey()]: {
							type: 'EntryFunction',
							attributes: {
								key: 'sortBy()',
								value: '(field: string, direction: "asc" | "desc" = "asc") -> Record',
								description: 'Sorts all items in the record',
							},
						},
						[getKey()]: {
							type: 'EntryFunction',
							attributes: {
								key: 'filterBy()',
								value: '(field: string, operator: Operator = "equals", value: any) -> Record',
								description:
									'Filter items based on the operator and value',
							},
						},
					},
				},
			})
		}
	}

	throw new Error('Unknown literal.')
}

export default class Dump extends Callable {
	arity() {
		return [Infinity]
	}

	call(args) {
		const $record = new Map()

		args.forEach(argument => {
			$record.merge(getEntry(argument.value))
		})

		throw new DumpSignal($record)
	}
}
