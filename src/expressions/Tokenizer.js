import Token from '@/expressions/Token'

const keywords = {
    true: 'TRUE',
    false: 'FALSE',
    or: 'OR',
    and: 'AND',
    null: 'NULL',
    equals: 'EQUALS',
    // not: 'NOT',
    // greater: 'GREATER',
    // less: 'LESS',
    // than: 'THAN',
}

function isDigit(character) {
    const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

    return digits.includes(character)
}

function isAlpha(character) {
    const lowercaseLetters = [
        'a',
        'b',
        'c',
        'd',
        'e',
        'f',
        'g',
        'h',
        'i',
        'j',
        'k',
        'l',
        'm',
        'n',
        'o',
        'p',
        'q',
        'r',
        's',
        't',
        'u',
        'v',
        'w',
        'x',
        'y',
        'z',
    ]
    const uppercaseLetters = [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z',
    ]

    return (
        lowercaseLetters.includes(character) ||
        uppercaseLetters.includes(character) ||
        character === '_'
    )
}

function isAlphaNumeric(character) {
    return isDigit(character) || isAlpha(character)
}

class Tokenizer {
    constructor(source) {
        this.source = source
        this.start = 0
        this.current = 0
        this.position = {
            line: 0,
            character: 0,
        }
        this.tokens = []
    }

    scanTokens() {
        while (!this.isAtEnd()) {
            this.start = this.current
            this.scanNextToken()
        }

        this.tokens.push(new Token('EOF', '', null, this.position))

        return this.tokens
    }

    scanNextToken() {
        const character = this.advance()

        switch (character) {
            case '(': {
                this.addToken('LEFT_PARENTHESIS')
                break
            }
            case ')': {
                this.addToken('RIGHT_PARENTHESIS')
                break
            }
            case '.': {
                this.addToken('DOT')
                break
            }
            case '+': {
                this.addToken('PLUS')
                break
            }
            case '-': {
                this.addToken('MINUS')
                break
            }
            case '*': {
                this.addToken('STAR')
                break
            }
            case '/': {
                this.addToken('SLASH')
                break
            }
            case ' ':
            case '\r':
            case '\t':
                break
            case '\n': {
                // Update position
                break
            }
            case '"': {
                this.string()
                break
            }
            default: {
                if (isDigit(character)) {
                    this.number()
                } else if (isAlpha(character)) {
                    this.identifier()
                } else {
                    throw new Error('Unexpected character.')
                }
            }
        }
    }

    number() {
        while (isDigit(this.peek())) {
            this.advance()
        }

        if (this.peek() == '.' && isDigit(this.peekNext())) {
            this.advance()

            while (isDigit(this.peek())) {
                this.advance()
            }
        }

        const value = Number(this.source.substring(this.start, this.current))

        this.addToken('NUMBER', value)
    }

    identifier() {
        while (isAlphaNumeric(this.peek())) {
            this.advance()
        }

        const text = this.source.substring(this.start, this.current)
        let type = keywords[text]

        if (!type) {
            type = 'IDENTIFIER'
        }

        this.addToken(type)
    }

    string() {
        while (this.peek() !== '"' && !this.isAtEnd()) {
            if (this.peek() == '\n') {
                // 'Update position'
            }

            this.advance()
        }

        if (this.isAtEnd()) {
            throw new Error('Unterminated string.')
            return
        }

        this.advance() // The closing "

        const value = this.source.substring(this.start + 1, this.current - 1) // Strip out "'s

        this.addToken('STRING', value)
    }

    peek() {
        if (this.isAtEnd()) {
            return '\0'
        }

        return this.source.charAt(this.current)
    }

    peekNext() {
        if (this.current + 1 >= this.source.length) {
            return '\0'
        }

        return this.source.charAt(this.current + 1)
    }

    isAtEnd() {
        return this.current >= this.source.length
    }

    advance() {
        const nextCharacter = this.source.charAt(this.current++)

        return nextCharacter
    }

    addToken(type, literal = '') {
        const text = this.source.substring(this.start, this.current)

        this.tokens.push(new Token(type, text, literal, this.position))
    }
}

export default Tokenizer
