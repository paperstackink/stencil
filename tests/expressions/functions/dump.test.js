// import Dump from '@/expressions/functions/Dump'
// import DumpSignal from '@/dumping/DumpSignal'
// import Expression from '@/expressions/Expression'
// import '@/setup'

test('X', () => {
	expect(true).toBe(true)
})

// test('it can dump a boolean', async () => {
// 	const callable = new Dump()

// 	let error

// 	try {
// 		const output = await callable.call([new Expression.Literal(false)])
// 	} catch (caught) {
// 		error = caught
// 	}

// 	expect(error).toBeInstanceOf(DumpSignal)
// 	expect(error.data.size).toEqual(1)

// 	const [_, entry] = error.data.entries().next().value

// 	expect(entry).toEqual(
// 		Map.fromObject({
// 			type: 'Literal',
// 			attributes: {
// 				value: false,
// 			},
// 		}),
// 	)
// })

// test('it can dump a number', async () => {
// 	const callable = new Dump()

// 	let error

// 	try {
// 		const output = await callable.call([new Expression.Literal(123.123)])
// 	} catch (caught) {
// 		error = caught
// 	}

// 	expect(error).toBeInstanceOf(DumpSignal)
// 	expect(error.data.size).toEqual(1)

// 	const [_, entry] = error.data.entries().next().value

// 	expect(entry).toEqual(
// 		Map.fromObject({
// 			type: 'Literal',
// 			attributes: {
// 				value: 123.123,
// 			},
// 		}),
// 	)
// })

// test('it can dump a date', async () => {
// 	const callable = new Dump()

// 	let error

// 	const date = new Date()

// 	try {
// 		const output = await callable.call([new Expression.Literal(date)])
// 	} catch (caught) {
// 		error = caught
// 	}

// 	expect(error).toBeInstanceOf(DumpSignal)
// 	expect(error.data.size).toEqual(1)

// 	const [_, entry] = error.data.entries().next().value

// 	expect(entry).toEqual(
// 		Map.fromObject({
// 			type: 'Literal',
// 			attributes: {
// 				value: date,
// 			},
// 		}),
// 	)
// })

// test('it can dump a string', async () => {
// 	const callable = new Dump()

// 	let error

// 	try {
// 		const output = await callable.call([new Expression.Literal('a string')])
// 	} catch (caught) {
// 		error = caught
// 	}

// 	expect(error).toBeInstanceOf(DumpSignal)
// 	expect(error.data.size).toEqual(1)

// 	const [_, entry] = error.data.entries().next().value

// 	expect(entry.get('type')).toEqual('RootString')

// 	const attributes = entry.get('attributes')

// 	expect(attributes.get('value')).toEqual('a string')
// 	expect(attributes.has('level')).toEqual(true)
// })

// test('it can dump a record', async () => {
// 	const callable = new Dump()

// 	let error

// 	const date = new Date()

// 	try {
// 		const output = await callable.call([
// 			new Expression.Literal(
// 				Map.fromObject({
// 					boolean: true,
// 					number: 123.123,
// 					date: date,
// 					string: 'a string',
// 					nested: {
// 						boolean: false,
// 					},
// 				}),
// 			),
// 		])
// 	} catch (caught) {
// 		error = caught
// 	}

// 	expect(error).toBeInstanceOf(DumpSignal)
// 	expect(error.data.size).toEqual(1)

// 	const [_, entry] = error.data.entries().next().value

// 	expect(entry.get('type')).toEqual('RootRecord')

// 	const attributes = entry.get('attributes')

// 	expect(attributes).toBeInstanceOf(Map)
// 	expect(attributes.has('level')).toEqual(true)
// 	expect(attributes.get('length')).toEqual(5)

// 	const children = attributes.get('children')

// 	expect(children).toBeInstanceOf(Map)
// 	expect(children.size).toEqual(5)

// 	const childIterator = children.entries()

// 	const [___, booleanChild] = childIterator.next().value

// 	expect(booleanChild).toEqual(
// 		Map.fromObject({
// 			type: 'EntryLiteral',
// 			attributes: {
// 				key: 'boolean',
// 				value: true,
// 			},
// 		}),
// 	)

// 	const [____, numberChild] = childIterator.next().value

// 	expect(numberChild).toEqual(
// 		Map.fromObject({
// 			type: 'EntryLiteral',
// 			attributes: {
// 				key: 'number',
// 				value: 123.123,
// 			},
// 		}),
// 	)

// 	const [_____, dateChild] = childIterator.next().value

// 	expect(dateChild).toEqual(
// 		Map.fromObject({
// 			type: 'EntryLiteral',
// 			attributes: {
// 				key: 'date',
// 				value: date,
// 			},
// 		}),
// 	)

// 	const [______, stringChild] = childIterator.next().value

// 	expect(stringChild).toBeInstanceOf(Map)
// 	expect(stringChild.get('type')).toEqual('EntryString')

// 	const stringChildAttributes = stringChild.get('attributes')

// 	expect(stringChildAttributes).toBeInstanceOf(Map)
// 	expect(stringChildAttributes.get('key')).toEqual('string')
// 	expect(stringChildAttributes.get('value')).toEqual('a string')
// 	expect(stringChildAttributes.has('level')).toEqual(true)

// 	const stringChildAttributesChildren = stringChildAttributes.get('children')

// 	expect(stringChildAttributesChildren).toBeInstanceOf(Map)

// 	const [_______, stringChildAttributesChildrenChild] =
// 		stringChildAttributesChildren.entries().next().value

// 	const [________, recordChild] = childIterator.next().value

// 	expect(recordChild).toBeInstanceOf(Map)
// 	expect(recordChild.get('type')).toEqual('EntryRecord')

// 	const recordChildAttributes = recordChild.get('attributes')

// 	expect(recordChildAttributes).toBeInstanceOf(Map)
// 	expect(recordChildAttributes.get('key')).toEqual('nested')
// 	expect(recordChildAttributes.get('length')).toEqual(1)
// 	expect(recordChildAttributes.has('level')).toEqual(true)

// 	const recordChildAttributesChildren = recordChildAttributes.get('children')

// 	expect(recordChildAttributesChildren).toBeInstanceOf(Map)
// 	expect(recordChildAttributesChildren.size).toEqual(1)

// 	const [_________, recordChildAttributesChildrenChild] =
// 		recordChildAttributesChildren.entries().next().value

// 	expect(recordChildAttributesChildrenChild).toEqual(
// 		Map.fromObject({
// 			type: 'EntryLiteral',
// 			attributes: {
// 				key: 'boolean',
// 				value: false,
// 			},
// 		}),
// 	)

// 	const recordChildAttributesMore = recordChildAttributes.get('more')

// 	expect(recordChildAttributesMore).toBeInstanceOf(Map)
// })

// test('it can dump multiple items', async () => {
// 	const callable = new Dump()

// 	let error

// 	try {
// 		const output = await callable.call([
// 			new Expression.Literal(false),
// 			new Expression.Literal(123),
// 		])
// 	} catch (caught) {
// 		error = caught
// 	}

// 	expect(error).toBeInstanceOf(DumpSignal)
// 	expect(error.data.size).toEqual(2)
// })
