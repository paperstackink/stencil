import conform from '@/helpers/conform'
import CompilationError from '@/errors/CompilationError'

describe('@if directives', () => {
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

    test('it can convert if statements inside loops', () => {
        const input = `<div>
    @each(item in items)
        @if(name equals "Yo")
            <span>Content</span>
        @endif
    @endeach
</div>`
        const condition = encodeURI('name equals "Yo"')
        const expected = `<div>
    <each variable="item" record="items">
        <if condition="${condition}">
            <span>Content</span>
        </if>
    </each>
</div>`

        const result = conform(input)

        expect(result).toBe(expected)
    })
})

describe('@each directives', () => {
    test('it can convert @if to <if>', () => {
        const input = `<div>
    @each(item in items)
        <span>{{ item }}</span>
    @endeach
</div>`
        const expected = `<div>
    <each variable="item" record="items">
        <span>{{ item }}</span>
    </each>
</div>`

        const result = conform(input)

        expect(result).toBe(expected)
    })

    test('it can convert an key', () => {
        const input = `<div>
    @each(item, key in items)
        <span>{{ item }}</span>
    @endeach
</div>`
        const expected = `<div>
    <each variable="item" record="items" key="key">
        <span>{{ item }}</span>
    </each>
</div>`

        const result = conform(input)

        expect(result).toBe(expected)
    })

    test('it ignores whitespace', () => {
        const input = `<div>
    @each    (  item,key   in   items  )
        <span>{{ item }}</span>
    @endeach
</div>`
        const expected = `<div>
    <each variable="item" record="items" key="key">
        <span>{{ item }}</span>
    </each>
</div>`

        const result = conform(input)

        expect(result).toBe(expected)
    })

    test('it can convert nested loops', () => {
        const input = `<div>
    @each(item in items)
        @each(item2 in items2)
            <span>{{ item }}</span>
        @endeach
    @endeach
</div>`
        const expected = `<div>
    <each variable="item" record="items">
        <each variable="item2" record="items2">
            <span>{{ item }}</span>
        </each>
    </each>
</div>`

        const result = conform(input)

        expect(result).toBe(expected)
    })

    test('it can convert loops inside if statements', () => {
        const input = `<div>
    @if(true)
        @each(item2 in items2)
            <span>{{ item }}</span>
        @endeach
    @endif
</div>`
        const expected = `<div>
    <if condition="true">
        <each variable="item2" record="items2">
            <span>{{ item }}</span>
        </each>
    </if>
</div>`

        const result = conform(input)

        expect(result).toBe(expected)
    })

    test('it fails if loop info is not provided', () => {
        const input = `<div>
    @each()
        <span>{{ item }}</span>
    @endeach
</div>`

        const runner = () => conform(input)

        expect(runner).toThrow(
            new CompilationError('No expressions provided to @each directive.'),
        )
    })

    test('it fails if loop info is no variable', () => {
        const input = `<div>
    @each(in items)
        <span>{{ item }}</span>
    @endeach
</div>`

        const runner = () => conform(input)

        expect(runner).toThrow(
            new CompilationError('No variable defined in @each directive.'),
        )
    })

    test('it fails if there is no record', () => {
        const input = `<div>
    @each(item in)
        <span>{{ item }}</span>
    @endeach
</div>`

        const runner = () => conform(input)

        expect(runner).toThrow(
            new CompilationError('No record defined in @each directive.'),
        )
    })

    test('it fails if there is not the same number of opening and closing statements', () => {
        const input = `<div>
    @each(item in items)
        @each(item in items)
        <span>{{ item }}</span>
    @endeach
</div>`
        const runner = () => conform(input)

        expect(runner).toThrow(
            new CompilationError(
                'There is an uneven number of opening and closing @each directives.',
            ),
        )
    })
})
