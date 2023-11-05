import Token from '@/expressions/Token'

import InternalError from '@/expressions/errors/InternalError'

import UppercaseOperator from '@/expressions/errors/UppercaseOperator'
import UnterminatedString from '@/expressions/errors/UnterminatedString'
import UnfinishedOperator from '@/expressions/errors/UnfinishedOperator'
import UnexpectedCharacter from '@/expressions/errors/UnexpectedCharacter'

const keywords = {
    true: 'TRUE',
    false: 'FALSE',
    or: 'OR',
    and: 'AND',
    null: 'NULL',
    equals: 'EQUALS',
    not: 'NOT',
    if: 'IF',
    then: 'THEN',
    else: 'ELSE',
    'not equals': 'NOT_EQUALS',
    'less than': 'LESS',
    'less than or equals': 'LESS_EQUALS',
    'greater than': 'GREATER',
    'greater than or equals': 'GREATER_EQUALS',
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

function isValidIdentifierCharacer(character) {
    return isAlphaNumeric(character) || character === '-'
}

class Tokenizer {
    constructor(source) {
        this.source = source
        this.start = 0
        this.current = 0
        this.tokens = []
    }

    scanTokens() {
        while (!this.isAtEnd()) {
            this.start = this.current
            this.scanNextToken()
        }

        this.tokens.push(new Token('EOF', '', null, this.current))

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
            case ',': {
                this.addToken('COMMA')
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
            case '\n': {
                break
            }
            case '"':
            case "'": {
                this.string()
                break
            }
            default: {
                if (isDigit(character)) {
                    this.number()
                } else if (
                    isAlpha(character) ||
                    character === '$' ||
                    character === '-'
                ) {
                    this.identifier()
                } else {
                    throw new UnexpectedCharacter(character)
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
        while (isValidIdentifierCharacer(this.peek())) {
            this.advance()
        }

        const text = this.source.substring(this.start, this.current)

        if (['less', 'greater'].includes(text)) {
            if (this.matchMany(' than or equals')) {
                this.addToken(
                    text === 'less' ? 'LESS_EQUALS' : 'GREATER_EQUALS',
                )
            } else if (this.matchMany(' than or')) {
                throw new UnfinishedOperator(
                    `${text} than or`,
                    `'${text} than' or '${text} than or equals'`,
                )
            } else if (this.matchMany(' than')) {
                this.addToken(text === 'less' ? 'LESS' : 'GREATER')
            } else {
                throw new UnfinishedOperator(text, `'${text} than'`)
            }
        } else if (text === 'not' && this.matchMany(' equals')) {
            this.addToken('NOT_EQUALS')
        } else {
            let type = keywords[text]

            if (!type && keywords[text.toLowerCase()]) {
                throw new UppercaseOperator(text)
            }

            if (!type) {
                type = 'IDENTIFIER'
            }

            this.addToken(type)
        }
    }

    string() {
        // Check whether it's a single or double quoted string
        if (this.previous() === "'") {
            while (this.peek() !== "'" && !this.isAtEnd()) {
                this.advance()
            }
        } else {
            while (this.peek() !== '"' && !this.isAtEnd()) {
                this.advance()
            }
        }

        if (this.isAtEnd()) {
            throw new UnterminatedString()
        }

        this.advance() // The closing " or '

        const value = this.source.substring(this.start + 1, this.current - 1) // Strip out quotes

        this.addToken('STRING', value)
    }

    peek() {
        if (this.isAtEnd()) {
            return '\0'
        }

        return this.source.charAt(this.current)
    }

    previous() {
        if (this.current === 0) {
            throw new InternalError("Can't read previous on first character")
        }

        return this.source.charAt(this.current - 1)
    }

    peekNext() {
        if (this.current + 1 >= this.source.length) {
            return '\0'
        }

        return this.source.charAt(this.current + 1)
    }

    peekN(n) {
        if (this.current + n >= this.source.length) {
            return '\0'
        }

        return this.source.charAt(this.current + n)
    }

    matchMany(expected) {
        if (this.isAtEnd()) {
            return false
        }

        const result = expected.split('').every((character, index) => {
            if (this.isAtEndN(index)) {
                return false
            }

            return this.peekN(index) === character
        })

        if (result) {
            this.advanceN(expected.length)
        }

        return result
    }

    isAtEnd() {
        return this.current >= this.source.length
    }

    isAtEndN(n) {
        return this.current + n >= this.source.length
    }

    advance() {
        const nextCharacter = this.source.charAt(this.current++)

        return nextCharacter
    }

    advanceN(n) {
        this.current = this.current + n

        const nextCharacter = this.source.charAt(this.current)

        return nextCharacter
    }

    addToken(type, literal = '') {
        const text = this.source.substring(this.start, this.current)

        this.tokens.push(
            new Token(type, text, literal, this.current - text.length),
        )
    }
}

export default Tokenizer
