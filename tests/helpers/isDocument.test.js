import isDocument from '@/helpers/isDocument'

test('it can detect a full html document', async () => {
    const input = `<html>Content</html>`
    const result = isDocument(input)

    expect(result).toBe(true)
})

test('it can detect a partial html document capitalised', async () => {
    const input = `<HTML>Content</HTML>`
    const result = isDocument(input)

    expect(result).toBe(true)
})

test('it can detect a partial html document', async () => {
    const input = `<div>Content</div>`
    const result = isDocument(input)

    expect(result).toBe(false)
})

test('it can detect a full html document starting with whitespace', async () => {
    const input = `    <html>Content</html>`
    const result = isDocument(input)

    expect(result).toBe(true)
})

test('it can detect a full html document starting with lowercase doctype', async () => {
    const input = `<!doctype`
    const result = isDocument(input)

    expect(result).toBe(true)
})

test('it can detect a full html document starting with uppercase doctype', async () => {
    const input = `<!DOCTYPE`
    const result = isDocument(input)

    expect(result).toBe(true)
})
