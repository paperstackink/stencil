import RuntimeError from '@/expressions/errors/RuntimeError'
import InternalError from '@/expressions/errors/InternalError'
import Expression from '@/expressions/Expression'

class Interpreter {
    constructor(ast, scope) {
        this.ast = ast
        this.scope = scope
    }

    interpret() {
        const output = this.evaluate(this.ast)

        return output
    }

    passes() {
        const output = this.evaluate(this.ast)

        return this.isTruthy(output.value)
    }

    visitLiteralExpression(expression) {
        return expression
    }

    visitGroupingExpression(expression) {
        return this.evaluate(expression.expression)
    }

    visitVariableExpression(expression) {
        if (expression.name in this.scope) {
            const resolved = this.scope[expression.name]

            return new Expression.Literal(resolved)
        }

        return new Expression.Literal(null)
    }

    visitUnaryExpression(expression) {
        const result = this.evaluate(expression.expression)

        switch (expression.operator.type) {
            case 'NOT': {
                return new Expression.Literal(!this.isTruthy(result.value))
            }
            case 'MINUS': {
                this.checkNumberOperand(expression.operator, result.value)

                return new Expression.Literal(-Number(result))
            }
        }

        throw new InternalError('Unexpected end of unary expression.')
    }

    visitLogicalExpression(expression) {
        const left = this.evaluate(expression.left)

        // Short circut if we already have a value after evaluting the left hand side
        if (expression.operator.type === 'OR') {
            if (this.isTruthy(left)) {
                return left
            }
        } else {
            if (!this.isTruthy(left)) {
                return left
            }
        }

        return this.evaluate(expression.right)
    }

    visitConditionalExpression(expression) {
        const condition = this.evaluate(expression.condition)

        if (condition.value) {
            return this.evaluate(expression.left)
        } else {
            return this.evaluate(expression.right)
        }
    }

    visitBinaryExpression(expression) {
        const left = this.evaluate(expression.left)
        const right = this.evaluate(expression.right)

        switch (expression.operator.type) {
            case 'EQUALS': {
                return new Expression.Literal(left.value === right.value)
            }
            case 'NOT_EQUALS': {
                return new Expression.Literal(left.value !== right.value)
            }
            case 'GREATER': {
                this.checkNumberOperands(
                    expression.operator,
                    left.value,
                    right.value,
                )

                return new Expression.Literal(
                    Number(left.value) > Number(right.value),
                )
            }
            case 'GREATER_EQUALS': {
                this.checkNumberOperands(
                    expression.operator,
                    left.value,
                    right.value,
                )

                return new Expression.Literal(
                    Number(left.value) >= Number(right.value),
                )
            }
            case 'LESS': {
                this.checkNumberOperands(
                    expression.operator,
                    left.value,
                    right.value,
                )

                return new Expression.Literal(
                    Number(left.value) < Number(right.value),
                )
            }
            case 'LESS_EQUALS': {
                this.checkNumberOperands(
                    expression.operator,
                    left.value,
                    right.value,
                )

                return new Expression.Literal(
                    Number(left.value) <= Number(right.value),
                )
            }
            case 'MINUS': {
                this.checkNumberOperands(
                    expression.operator,
                    left.value,
                    right.value,
                )

                return new Expression.Literal(
                    Number(left.value) - Number(right.value),
                )
            }
            case 'PLUS': {
                if (
                    typeof left.value === 'number' &&
                    typeof right.value === 'number'
                ) {
                    return new Expression.Literal(
                        Number(left.value) + Number(right.value),
                    )
                }

                if (
                    typeof left.value === 'string' &&
                    typeof right.value === 'string'
                ) {
                    return new Expression.Literal(
                        String(left.value) + String(right.value),
                    )
                }

                throw new RuntimeError(
                    'Operands must be two numbers or two strings',
                )
            }
            case 'SLASH': {
                this.checkNumberOperands(
                    expression.operator,
                    left.value,
                    right.value,
                )

                return new Expression.Literal(
                    Number(left.value) / Number(right.value),
                )
            }
            case 'STAR': {
                this.checkNumberOperands(
                    expression.operator,
                    left.value,
                    right.value,
                )

                return new Expression.Literal(
                    Number(left.value) * Number(right.value),
                )
            }
        }

        throw new InternalError('Unexpected end of binary expression.')
    }

    checkNumberOperand(operator, operand) {
        if (typeof operand === 'number') {
            return
        }

        throw new RuntimeError('Operand must be a number.')
    }

    checkNumberOperands(operator, left, right) {
        if (typeof left === 'number' && typeof right === 'number') {
            return
        }

        throw new RuntimeError('Operand must be a number.')
    }

    isTruthy(object) {
        if (object === null) {
            return false
        }

        if (typeof object === 'boolean') {
            return object
        }

        if (typeof object === 'number') {
            return object !== 0
        }

        if (typeof object === 'string') {
            return object !== ''
        }

        return true
    }

    evaluate(expression) {
        return expression.accept(this)
    }
}

export default Interpreter
