import Expression from '@/expressions/Expression'

import ParserError from '@/expressions/errors/ParserError'

class Parser {
    constructor(tokens = []) {
        this.tokens = tokens
        this.current = 0
    }

    parse() {
        return this.expression()
    }

    expression() {
        return this.equality()
    }

    equality() {
        let expression = this.comparison()

        while (this.match('EQUALS', 'NOT_EQUALS')) {
            const operator = this.previous()
            const right = this.comparison()
            expression = new Expression.Binary(expression, operator, right)
        }

        return expression
    }

    comparison() {
        let expression = this.terminus()

        while (this.match('GREATER', 'GREATER_EQUALS', 'LESS', 'LESS_EQUALS')) {
            const operator = this.previous()
            const right = this.terminus()
            expression = new Expression.Binary(expression, operator, right)
        }

        return expression
    }

    terminus() {
        let expression = this.factor()

        while (this.match('MINUS', 'PLUS')) {
            const operator = this.previous()
            const right = this.factor()
            expression = new Expression.Binary(expression, operator, right)
        }

        return expression
    }

    factor() {
        let expression = this.unary()

        while (this.match('SLASH', 'STAR')) {
            const operator = this.previous()
            const right = this.unary()
            expression = new Expression.Binary(expression, operator, right)
        }

        return expression
    }

    unary() {
        if (this.match('NOT', 'MINUS')) {
            const operator = this.previous()
            const expression = this.unary()

            return new Expression.Unary(operator, expression)
        }

        return this.primary()
    }

    primary() {
        if (this.match('FALSE')) {
            return new Expression.Literal(false)
        }

        if (this.match('TRUE')) {
            return new Expression.Literal(true)
        }

        if (this.match('NULL')) {
            return new Expression.Literal(null)
        }

        if (this.match('NUMBER', 'STRING')) {
            return new Expression.Literal(this.previous().literal)
        }

        if (this.match('IDENTIFIER')) {
            return new Expression.Variable(this.previous().lexeme)
        }

        if (this.match('LEFT_PARENTHESIS')) {
            const expression = this.expression()

            this.consume('RIGHT_PARENTHESIS', "Expect ')' after expression.")

            return new Expression.Grouping(expression)
        }

        throw new ParserError('Expected expression.')
    }

    match(...types) {
        for (const type of types) {
            if (this.check(type)) {
                this.advance()

                return true
            }
        }

        return false
    }

    check(type) {
        if (this.isAtEnd()) {
            return false
        }

        return this.peek().type === type
    }

    consume(type, message) {
        if (this.check(type)) {
            return this.advance()
        }

        throw new ParserError(message)
    }

    advance() {
        if (!this.isAtEnd()) {
            this.current++
        }

        return this.previous()
    }

    previous() {
        return this.tokens[this.current - 1]
    }

    peek() {
        return this.tokens[this.current]
    }

    isAtEnd() {
        return this.peek().type === 'EOF'
    }
}

export default Parser
