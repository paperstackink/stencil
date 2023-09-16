import { compile } from '@/index'
import NoFrontMatterError from '@/errors/NoFrontMatterError'
import UnknownTemplateInMarkdown from '@/errors/UnknownTemplateInMarkdown'
import NoTemplateInMarkdownPageError from '@/errors/NoTemplateInMarkdownPageError'
import NoDefaultSlotInMarkdownTemplate from '@/errors/NoDefaultSlotInMarkdownTemplate'

test('it can compile markdown', async () => {
    const input = `
---
template: Template
---

# Heading 1

This is a paragraph
`
    const templateDefinition = `
<article>
    <slot />
</article>
`
    const expected = `
<article>
    <h1>Heading 1</h1>
    <p>This is a paragraph</p>
</article>
`

    const result = await compile(
        input,
        {
            components: { Template: templateDefinition },
        },
        {
            language: 'markdown',
        },
    )

    expect(result).toEqualIgnoringWhitespace(expected)
})

test.todo('it can print content via a variable')

test('it can compile markdown with Stencil components', async () => {
    const input = `
---
template: Template
---

# Heading 1

<Thing />

This is a paragraph
`
    const templateDefinition = `
<article>
    <Thing />
    <slot />
</article>
`
    const componentDefinition = `
<span>Thing</span>
`
    const expected = `
<article>
    <span>Thing</span>
    <h1>Heading 1</h1>
    <span>Thing</span>
    <p>This is a paragraph</p>
</article>
`

    const result = await compile(
        input,
        {
            components: {
                Template: templateDefinition,
                Thing: componentDefinition,
            },
        },
        {
            language: 'markdown',
        },
    )

    expect(result).toEqualIgnoringWhitespace(expected)
})

test('it fails if there is no frontmatter', async () => {
    const input = `
# Heading 1

This is a paragraph
`
    const templateDefinition = `
<article>
    <slot />
</article>
`

    await expect(
        compile(
            input,
            {
                components: {
                    Template: templateDefinition,
                },
            },
            {
                language: 'markdown',
            },
        ),
    ).rejects.toThrow(new NoFrontMatterError())
})

test('it fails if template is not defined', async () => {
    const input = `
---
unrelated: true
---
# Heading 1

This is a paragraph
`
    const templateDefinition = `
<article>
    <slot />
</article>
`

    await expect(
        compile(
            input,
            {
                components: {
                    Template: templateDefinition,
                },
            },
            {
                language: 'markdown',
            },
        ),
    ).rejects.toThrow(new NoTemplateInMarkdownPageError())
})

test('it fails if template does not exist', async () => {
    const input = `
---
template: DoesNotExist
---
# Heading 1

This is a paragraph
`
    const templateDefinition = `
<article>
    <slot />
</article>
`

    await expect(
        compile(
            input,
            {
                components: {
                    Template: templateDefinition,
                },
            },
            {
                language: 'markdown',
            },
        ),
    ).rejects.toThrow(new UnknownTemplateInMarkdown())
})

test('it fails if the templates does not have a default slot', async () => {
    const input = `
---
template: Template
---

# Heading 1

This is a paragraph
`
    const templateDefinition = `
<article>
    <div></div>
</article>
`

    await expect(
        compile(
            input,
            {
                components: {
                    Template: templateDefinition,
                },
            },
            {
                language: 'markdown',
            },
        ),
    ).rejects.toThrow(new NoDefaultSlotInMarkdownTemplate())
})
