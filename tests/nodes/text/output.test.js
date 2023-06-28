import { compile } from '@/index'
import CompilationError from '@/errors/CompilationError'

test('it can compile expressions', async () => {
    const input = `<span>{{ value }}</span>`
    const expected = `<span>Outputted text</span>`

    const result = await compile(input, {
        environment: { value: 'Outputted text' },
    })

    expect(result).toBe(expected)
})

// test('it injects an html string as html', async () => {
//     const input = `<div>Text. {{ content }} Text</div>`
//     const expected = `
// <div>
//     Text.
//     <p>HTML</p>
//     <p>More HTML</p>
//     Text
// </div>
// `

//     const result = await compile(input, {
//         environment: { content: '<p>HTML</p><p>More HTML</p>' },
//     })

//     expect(result).toEqualIgnoringWhitespace(expected)
// })

// test('it can inject both a regular string and html', async () => {
//     const input = `<div>{{ title }}{{ content }}{{title}}</div>`
//     const expected = `
// <div>
//     Title
//     <p>HTML</p>
//     Title
// </div>
// `

//     const result = await compile(input, {
//         environment: {
//             title: 'Title',
//             content: '<p>HTML</p>',
//         },
//     })

//     expect(result).toEqualIgnoringWhitespace(expected)
// })
