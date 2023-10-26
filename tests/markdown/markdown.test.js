import { compile } from '@/index'
import NoFrontMatter from '@/errors/NoFrontMatter'
import EmptyFrontmatter from '@/errors/EmptyFrontmatter'
import NoLayoutInFrontmatter from '@/errors/NoLayoutInFrontmatter'
import UnknownLayoutInMarkdown from '@/errors/UnknownLayoutInMarkdown'
import NoDefaultSlotInMarkdownLayout from '@/errors/NoDefaultSlotInMarkdownLayout'
import InvalidLinkHeadlinesInMarkdownConfig from '@/errors/InvalidLinkHeadlinesInMarkdownConfig'

test('it can compile markdown', async () => {
    const input = `
---
layout: Layout
---

# Heading 1

This is a paragraph
`
    const layoutDefinition = `
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
            components: { Layout: layoutDefinition },
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
layout: Layout
---

# Heading 1

<Thing />

This is a paragraph
`
    const layoutDefinition = `
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
                Layout: layoutDefinition,
                Thing: componentDefinition,
            },
        },
        {
            language: 'markdown',
        },
    )

    expect(result).toEqualIgnoringWhitespace(expected)
})

test('it adds attributes to absolute links', async () => {
    const input = `
---
layout: Layout
---

# Heading 1

[This is an external link](https://example.com)
`
    const layoutDefinition = `
<article>
    <slot />
</article>
`
    const expected = `
<article>
    <h1>Heading 1</h1>
    <p>
        <a href="https://example.com" target="_blank" rel="nofollow noopener noreferrer">This is an external link</a>
    </p>
</article>
`

    const result = await compile(
        input,
        {
            components: { Layout: layoutDefinition },
        },
        {
            language: 'markdown',
        },
    )

    expect(result).toEqualIgnoringWhitespace(expected)
})

test("it doesn't add attributes to relative links", async () => {
    const input = `
---
layout: Layout
---

# Heading 1

[This is an external link](/documentation)
`
    const layoutDefinition = `
<article>
    <slot />
</article>
`
    const expected = `
<article>
    <h1>Heading 1</h1>
    <p>
        <a href="/documentation">This is an external link</a>
    </p>
</article>
`

    const result = await compile(
        input,
        {
            components: { Layout: layoutDefinition },
        },
        {
            language: 'markdown',
        },
    )

    expect(result).toEqualIgnoringWhitespace(expected)
})

test('it compiles markdown tables', async () => {
    const input = `
---
layout: Layout
---

# Heading 1

| Column 1         | Column 2         |
| ---------------- | ---------------- |
| Row 1 / Column 1 | Row 1 / Column 2 |
| Row 2 / Column 1 | Row 2 / Column 2 |
`
    const layoutDefinition = `
<article>
    <slot />
</article>
`
    const expected = `
<article>
    <h1>Heading 1</h1>
    <table>
        <thead>
            <tr>
                <th>Column 1</th>
                <th>Column 2</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Row 1 / Column 1</td>
                <td>Row 1 / Column 2</td>
            </tr>
            <tr>
                <td>Row 2 / Column 1</td>
                <td>Row 2 / Column 2</td>
            </tr>
        </tbody>
    </table>
</article>
`

    const result = await compile(
        input,
        {
            components: { Layout: layoutDefinition },
        },
        {
            language: 'markdown',
        },
    )

    expect(result).toEqualIgnoringWhitespace(expected)
})

test('it fails if there is no front matter block', async () => {
    const input = `
# Heading 1

This is a paragraph
`
    const layoutDefinition = `
<article>
    <slot />
</article>
`

    await expect(
        compile(
            input,
            {
                components: {
                    Layout: layoutDefinition,
                },
            },
            {
                language: 'markdown',
            },
        ),
    ).rejects.toThrowCompilationError(NoFrontMatter)
})

test('it fails if there is an empty front matter block', async () => {
    const input = `---

---

# Heading 1

This is a paragraph
`
    const layoutDefinition = `
<article>
    <slot />
</article>
`

    await expect(
        compile(
            input,
            {
                components: {
                    Layout: layoutDefinition,
                },
            },
            {
                language: 'markdown',
            },
        ),
    ).rejects.toThrowCompilationError(EmptyFrontmatter)
})

test('it fails if layout is not defined', async () => {
    const input = `
---
unrelated: true
---
# Heading 1

This is a paragraph
`
    const layoutDefinition = `
<article>
    <slot />
</article>
`

    await expect(
        compile(
            input,
            {
                components: {
                    Layout: layoutDefinition,
                },
            },
            {
                language: 'markdown',
            },
        ),
    ).rejects.toThrowCompilationError(NoLayoutInFrontmatter)
})

test('it fails if layout does not exist', async () => {
    const input = `
---
layout: DoesNotExist
---
# Heading 1

This is a paragraph
`
    const layoutDefinition = `
<article>
    <slot />
</article>
`

    await expect(
        compile(
            input,
            {
                components: {
                    Layout: layoutDefinition,
                },
            },
            {
                language: 'markdown',
            },
        ),
    ).rejects.toThrowCompilationError(UnknownLayoutInMarkdown)
})

test('it fails if the layout does not have a default slot', async () => {
    const input = `
---
layout: Layout
---

# Heading 1

This is a paragraph
`
    const layoutDefinition = `
<article>
    <div></div>
</article>
`

    await expect(
        compile(
            input,
            {
                components: {
                    Layout: layoutDefinition,
                },
            },
            {
                language: 'markdown',
            },
        ),
    ).rejects.toThrowCompilationError(NoDefaultSlotInMarkdownLayout)
})

describe('Config options', () => {
    describe('linkHeadlines', () => {
        test('it can autolink headlines', async () => {
            const input = `
---
layout: Layout
---

# Headline 1

## Headline 2
`
            const layoutDefinition = `
<article>
    <slot />
</article>
`
            const expected = `
<article>
    <h1 id="headline-1"><a href="#headline-1">Headline 1</a></h1>
    <h2 id="headline-2"><a href="#headline-2">Headline 2</a></h2>
</article>
`

            const result = await compile(
                input,
                {
                    config: {
                        markdown: {
                            linkHeadlines: 'wrap',
                        },
                    },
                    components: { Layout: layoutDefinition },
                },
                {
                    language: 'markdown',
                },
            )

            expect(result).toEqualIgnoringWhitespace(expected)
        })

        test('it can not autolink headlines', async () => {
            const input = `
---
layout: Layout
---

# Headline 1

## Headline 2
`
            const layoutDefinition = `
<article>
    <slot />
</article>
`
            const expected = `
<article>
    <h1>Headline 1</h1>
    <h2>Headline 2</h2>
</article>
`

            const result = await compile(
                input,
                {
                    config: {
                        markdown: {
                            linkHeadlines: null,
                        },
                    },
                    components: { Layout: layoutDefinition },
                },
                {
                    language: 'markdown',
                },
            )

            expect(result).toEqualIgnoringWhitespace(expected)
        })

        test('it fails if the config value is invalid', async () => {
            const input = `
---
layout: Layout
---

# Headline 1

## Headline 2
`
            const layoutDefinition = `
<article>
    <slot />
</article>
`
            const expected = `
<article>
    <h1>Headline 1</h1>
    <h2>Headline 2</h2>
</article>
`

            await expect(
                compile(
                    input,
                    {
                        config: {
                            markdown: {
                                linkHeadlines: 'invalid',
                            },
                        },
                        components: {
                            Layout: layoutDefinition,
                        },
                    },
                    {
                        language: 'markdown',
                    },
                ),
            ).rejects.toThrowCompilationError(
                InvalidLinkHeadlinesInMarkdownConfig,
            )
        })
    })
})
