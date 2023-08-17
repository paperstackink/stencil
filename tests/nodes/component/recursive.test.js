import { compile } from '@/index'

test('it can compile a recursive component', async () => {
	const input = `
<div>
    <Recursive recurse="true" />
</div>
`
	const componentDefiniton = `
<div data-recursed="{{ recurse }}">
	@if(recurse equals 'true')
		<Recursive recurse="false" />
	@endif
</div>
`
	const expected = `
<div>
    <div data-recursed="true">
	    <div data-recursed="false">
	    </div>
    </div>
</div>
`

	const result = await compile(input, {
		components: { Recursive: componentDefiniton },
	})

	expect(result).toEqualIgnoringWhitespace(expected)
})

test('it can compile circular components', async () => {
	const input = `
<div>
    <A recurse="true" />
</div>
`
	const aComponentDefiniton = `
<div data-component="a">
	@if(recurse equals 'true')
		<B />
	@endif
</div>
`
	const bComponentDefiniton = `
<div data-component="b">
	<A recurse="false"/>
</div>
`
	const expected = `
<div>
    <div data-component="a">
	    <div data-component="b">
	    	<div data-component="a" recurse="false">
	    	</div>
	    </div>
    </div>
</div>
`

	const result = await compile(input, {
		components: { A: aComponentDefiniton, B: bComponentDefiniton },
	})

	expect(result).toEqualIgnoringWhitespace(expected)
})
