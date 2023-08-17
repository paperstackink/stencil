import { compile } from '@/index'
import UnknownComponentNameError from '@/errors/UnknownComponentNameError'
import ComponentNameNotProvidedError from '@/errors/ComponentNameNotProvidedError'

test('it can compile a dynamic component', async () => {
	const input = `
<div>
    <Component is="Card" />
</div>
`
	const componentDefiniton = `
<section class="card">
    <div>This is a card</div>
</section>
`
	const expected = `
<div>
    <section class="card">
        <div>This is a card</div>
    </section>
</div>
`

	const result = await compile(input, {
		components: { Card: componentDefiniton },
	})

	expect(result).toEqualIgnoringWhitespace(expected)
})

test('props are applied to the resolved component', async () => {
	const input = `
<div>
    <Component is="Card" data-applied="true" />
</div>
`
	const componentDefiniton = `
<section class="card">
    <div>This is a card</div>
</section>
`
	const expected = `
<div>
    <section class="card" data-applied="true">
        <div>This is a card</div>
    </section>
</div>
`

	const result = await compile(input, {
		components: { Card: componentDefiniton },
	})

	expect(result).toEqualIgnoringWhitespace(expected)
})

test('slots are applied to the resolved component', async () => {
	const input = `
<div>
    <Component is="Card">
    	Slot content
    </Component>
</div>
`
	const componentDefiniton = `
<section class="card">
    <div>
    	<slot />
    </div>
</section>
`
	const expected = `
<div>
    <section class="card">
        <div>Slot content</div>
    </section>
</div>
`

	const result = await compile(input, {
		components: { Card: componentDefiniton },
	})

	expect(result).toEqualIgnoringWhitespace(expected)
})

test('it can resolved the component name with an expression', async () => {
	const input = `
<div>
    <Component is="{{ if true then 'Card' else 'Noop' }}" />
</div>
`
	const componentDefiniton = `
<section class="card">
    <div>This is a card</div>
</section>
`
	const expected = `
<div>
    <section class="card">
        <div>This is a card</div>
    </section>
</div>
`

	const result = await compile(input, {
		components: { Card: componentDefiniton },
	})

	expect(result).toEqualIgnoringWhitespace(expected)
})

test('it errors if no component name is provided', async () => {
	const input = `
<div>
    <Component />
</div>
`
	const componentDefiniton = `
<section class="card">
    <div>This is a card</div>
</section>
`

	await expect(
		compile(input, {
			components: { Card: componentDefiniton },
		}),
	).rejects.toThrow(ComponentNameNotProvidedError)
})

test("it errors if the dynamic component name doesn't exist", async () => {
	const input = `
<div>
    <Component is="Card"  />
</div>
`

	await expect(
		compile(input, {
			components: {},
		}),
	).rejects.toThrow(UnknownComponentNameError)
})
