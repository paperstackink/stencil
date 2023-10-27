import Expression from '@/expressions/Expression'

import TooManyArguments from '@/expressions/errors/TooManyArguments'
import MissingExpression from '@/expressions/errors/MissingExpression'
import MissingThenClause from '@/expressions/errors/MissingThenClause'
import MissingElseClause from '@/expressions/errors/MissingElseClause'
import UnclosedFunctionCall from '@/expressions/errors/UnclosedFunctionCall'
import UnclosedGroupExpression from '@/expressions/errors/UnclosedGroupExpression'
import UnfinishedPropertyAccess from '@/expressions/errors/UnfinishedPropertyAccess'

class Parser {
    constructor(tokens = []) {
        this.tokens = tokens
        this.current = 0
    }

    parse() {
        return this.expression()
    }

    expression() {
        return this.conditional()
    }

    conditional() {
        if (this.match('IF')) {
            const condition = this.or()

            this.consume('THEN', new MissingThenClause())

            const left = this.or()

            this.consume('ELSE', new MissingElseClause())

            const right = this.or()

            return new Expression.Conditional(condition, left, right)
        } else {
            return this.or()
        }
    }

    or() {
        let expression = this.and()

        while (this.match('OR')) {
            const operator = this.previous()
            const right = this.and()
            expression = new Expression.Logical(expression, operator, right)
        }

        return expression
    }

    and() {
        let expression = this.equality()

        while (this.match('AND')) {
            const operator = this.previous()
            const right = this.equality()
            expression = new Expression.Logical(expression, operator, right)
        }

        return expression
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

        return this.call()
    }

    call() {
        let expression = this.primary()

        while (true) {
            if (this.match('LEFT_PARENTHESIS')) {
                expression = this.finishCall(expression)
            } else if (this.match('DOT')) {
                const name = this.consume(
                    'IDENTIFIER',
                    new UnfinishedPropertyAccess(),
                )

                expression = new Expression.Get(expression, name)
            } else {
                break
            }
        }

        return expression
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

            this.consume('RIGHT_PARENTHESIS', new UnclosedGroupExpression())

            return new Expression.Grouping(expression)
        }

        throw new MissingExpression()
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

    consume(type, error) {
        if (this.check(type)) {
            return this.advance()
        }

        throw error
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

    finishCall(callee) {
        let args = []

        if (!this.check('RIGHT_PARENTHESIS')) {
            do {
                if (args.length >= 255) {
                    throw new TooManyArguments(args.length)
                }

                args.push(this.expression())
            } while (this.match('COMMA'))
        }

        const parenthesis = this.consume(
            'RIGHT_PARENTHESIS',
            new UnclosedFunctionCall(),
        )

        return new Expression.Call(callee, parenthesis, args)
    }
}

export default Parser
