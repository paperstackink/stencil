import { v4 as uuid } from 'uuid'

import Callable from '@/expressions/functions/Callable'
import DumpSignal from '@/dumping/DumpSignal'

function getKey() {
	return `key-${uuid()}`
}

function getStringMethods() {
	return {
		[getKey()]: {
			type: 'EntryFunction',
			attributes: {
				key: 'slug()',
				value: '() -> String',
				description: 'Converts the string to kebab case',
			},
		},
		[getKey()]: {
			type: 'EntryFunction',
			attributes: {
				key: 'lowerCase()',
				value: '() -> String',
				description: 'Converts the string to lower case',
			},
		},
		[getKey()]: {
			type: 'EntryFunction',
			attributes: {
				key: 'upperCase()',
				value: '() -> String',
				description: 'Converts the string to upper case',
			},
		},
		[getKey()]: {
			type: 'EntryFunction',
			attributes: {
				key: 'titleCase()',
				value: '() -> String',
				description: 'Converts the string to title case',
			},
		},
		[getKey()]: {
			type: 'EntryFunction',
			attributes: {
				key: 'camelCase()',
				value: '() -> String',
				description: 'Converts the string to camel case',
			},
		},
		[getKey()]: {
			type: 'EntryFunction',
			attributes: {
				key: 'snakeCase()',
				value: '() -> String',
				description: 'Converts the string to snake case',
			},
		},
		[getKey()]: {
			type: 'EntryFunction',
			attributes: {
				key: 'kebabCase()',
				value: '() -> String',
				description: 'Converts the string to kebab case',
			},
		},
		[getKey()]: {
			type: 'EntryFunction',
			attributes: {
				key: 'pascalCase()',
				value: '() -> String',
				description: 'Converts the string to pascal case',
			},
		},
		[getKey()]: {
			type: 'EntryFunction',
			attributes: {
				key: 'sentenceCase()',
				value: '() -> String',
				description: 'Converts the string to sentence case',
			},
		},
	}
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
						children: getStringMethods(),
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
					children: getStringMethods(),
				},
			})
		}
	}

	if (value === null && !key) {
		return Map.fromObject({
			[getKey()]: {
				type: 'Literal',
				attributes: {
					value: 'null',
				},
			},
		})
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
						more: {
							[getKey()]: {
								type: 'EntryFunction',
								attributes: {
									key: 'sortBy()',
									value: '(field: string, direction: "asc" | "desc" = "asc") -> Record',
									description:
										'Sorts all items in the record',
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
							[getKey()]: {
								type: 'EntryFunction',
								attributes: {
									key: 'findBy()',
									value: '(field: string, operator: Operator = "equals", value: any) -> Record',
									description:
										'Find the first item in the record that matches the condition',
								},
							},
						},
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
						[getKey()]: {
							type: 'EntryFunction',
							attributes: {
								key: 'findBy()',
								value: '(field: string, operator: Operator = "equals", value: any) -> Record',
								description:
									'Find the first item in the record that matches the condition',
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
	name() {
		return 'dump'
	}

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
