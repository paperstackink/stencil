import isHtml from '@/helpers/isHtml'

test('it can detect a full html document', async () => {
    const input = `<html>Content</html>`
    const result = isHtml(input)

    expect(result).toBe(true)
})

test('empty string is not html', async () => {
    const input = ``
    const result = isHtml(input)

    expect(result).toBe(false)
})

test('whitespace is not html', async () => {
    const input = `\n     `
    const result = isHtml(input)

    expect(result).toBe(false)
})
