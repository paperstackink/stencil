import { compile } from '@/index'

test('it can print values in attributes', async () => {
    const input = `<Text id="{{ id }}">Text</Text>`
    const definition = `<span><slot /></span>`
    const expected = `<span id="headline">Text</span>`

    const result = await compile(input, {
        environment: { global: { id: 'headline' } },
        components: {
            Text: definition,
        },
    })

    expect(result).toBe(expected)
})

// test('it can output multiple values in the same attribute', async () => {
//     const input = `<span class="{{ color }} {{ size }}">Text</span>`
//     const expected = `<span class="red large">Text</span>`

//     const result = await compile(input, {
//         environment: { color: 'red', size: 'large' },
//     })

//     expect(result).toBe(expected)
// })

// test('it can output multiple values in different attributes', async () => {
//     const input = `<span class="{{ class }}" id="{{ id }}">Text</span>`
//     const expected = `<span class="text-red" id="text-element">Text</span>`

//     const result = await compile(input, {
//         environment: { className: 'text-red', id: 'text-element' },
//     })

//     expect(result).toBe(expected)
// })

// test('it can output the same value multiple times', async () => {
//     const input = `<span class="{{ name }}" id="{{ name }}">Text</span>`
//     const expected = `<span class="title" id="title">Text</span>`

//     const result = await compile(input, {
//         environment: { name: 'title' },
//     })

//     expect(result).toBe(expected)
// })

// test('it can output values concatenated to an existing attribute', async () => {
//     const input = `<span class="text-{{ size }}">Text</span>`
//     const expected = `<span class="text-large">Text</span>`

//     const result = await compile(input, {
//         environment: { size: 'large' },
//     })

//     expect(result).toBe(expected)
// })

// test('it fails if the value has not been defined', async () => {
//     const input = `<span class="{{ class }}">Text</span>`

//     await expect(
//         compile(input, {
//             environment: {},
//         }),
//     ).rejects.toThrow(CompilationError)
// })

// test('it ignores regular string attributes', async () => {
//     const input = `<span class="text">Text</span>`
//     const expected = `<span class="text">Text</span>`

//     const result = await compile(input, {
//         environment: {},
//     })

//     expect(result).toBe(expected)
// })

// test('it ignores regular boolean attributes', async () => {
//     const input = `<input disabled="true" />`
//     const expected = `<input disabled />`

//     const result = await compile(input, {
//         environment: {},
//     })

//     expect(result).toBe(expected)
// })

// test('it ignores regular number attributes', async () => {
//     const input = `<input maxlength="4" />`
//     const expected = `<input maxlength="4" />`

//     const result = await compile(input, {
//         environment: {},
//     })

//     expect(result).toBe(expected)
// })

// test('it ignores attributes with an empty value', async () => {
//     const input = `<input disabled="" />`
//     const expected = `<input disabled />`

//     const result = await compile(input, {
//         environment: {},
//     })

//     expect(result).toBe(expected)
// })

// test('it ignores attributes with no value', async () => {
//     const input = `<input disabled />`
//     const expected = `<input disabled />`

//     const result = await compile(input, {
//         environment: {},
//     })

//     expect(result).toBe(expected)
// })
