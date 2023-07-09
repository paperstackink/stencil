import conform from '@/helpers/conform'
import CompilationError from '@/errors/CompilationError'

describe('If directives', () => {
    test('it can convert @if to <if>', async () => {
        const input = `<div>
    @if(true)
        <span>Content</span>
    @endif
</div>`
        const expected = `<div>
    <if condition="true">
        <span>Content</span>
    </if>
</div>`

        const result = conform(input)

        expect(result).toBe(expected)
    })

    test('it can convert sibling @ifs', async () => {
        const input = `<div>
    @if(true)
        <span>Content</span>
    @endif    
    @if(false)
        <span>Content</span>
    @endif
</div>`
        const expected = `<div>
    <if condition="true">
        <span>Content</span>
    </if>    
    <if condition="false">
        <span>Content</span>
    </if>
</div>`

        const result = conform(input)

        expect(result).toBe(expected)
    })

    test('it can convert nested @ifs', async () => {
        const input = `<div>
    @if(true)
        @if(false)
            <span>Content</span>
        @endif
    @endif
</div>`
        const expected = `<div>
    <if condition="true">
        <if condition="false">
            <span>Content</span>
        </if>
    </if>
</div>`

        const result = conform(input)

        expect(result).toBe(expected)
    })

    test('it can convert @ifs with expressions that contain parenthesis', async () => {
        const input = `<div>
        @if(2 * (3 + 4))
            <span>Content</span>
        @endif
    </div>`

        const condition = encodeURI('2 * (3 + 4)')
        const expected = `<div>
        <if condition="${condition}">
            <span>Content</span>
        </if>
    </div>`

        const result = conform(input)

        expect(result).toBe(expected)
    })

    test('it fails if no expression is provided', async () => {
        const input = `<div>
    @if()
        <span>Content</span>
    @endif
</div>`

        const runner = () => conform(input)

        expect(runner).toThrow(
            new CompilationError('No expressions provided to @if directive.'),
        )
    })

    test('it fails if there is not the same number of opening and closing statements', async () => {
        const input = `<div>
    @if(true)
        <span>Content</span>
</div>`

        const runner = () => conform(input)

        expect(runner).toThrow(
            new CompilationError(
                'There is an uneven number of opening and closing @if directives.',
            ),
        )
    })

    test('it can handle expressions with quotes', async () => {
        const input = `<div>
    @if(name equals "Yo")
        <span>Content</span>
    @endif
</div>`
        const condition = encodeURI('name equals "Yo"')
        const expected = `<div>
    <if condition="${condition}">
        <span>Content</span>
    </if>
</div>`

        const result = conform(input)

        expect(result).toBe(expected)
    })
})
