import { compile } from '@/index'
import ReservedComponentNameError from '@/errors/ReservedComponentNameError'

test("it errors if providing a component called 'Component'", async () => {
	const input = `
<div></div>
`
	const componentDefiniton = `
<section class="card">
    <div>This is a card</div>
</section>
`

	await expect(
		compile(input, {
			components: { Component: componentDefiniton },
		}),
	).rejects.toThrow(ReservedComponentNameError)
})

test("it errors if providing a component called 'Data'", async () => {
	const input = `
<div></div>
`
	const componentDefiniton = `
<section class="card">
    <div>This is a card</div>
</section>
`

	await expect(
		compile(input, {
			components: { Data: componentDefiniton },
		}),
	).rejects.toThrow(ReservedComponentNameError)
})
