import Expression from '@/expressions/Expression'
import { getType } from '@/expressions/helpers/getType'

import InternalError from '@/expressions/errors/InternalError'
import ArityMismatch from '@/expressions/errors/ArityMismatch'
import NullMethodAccess from '@/expressions/errors/NullMethodAccess'
import NonNumberOperand from '@/expressions/errors/NonNumberOperand'
import NullPropertyAccess from '@/expressions/errors/NullPropertyAccess'
import CallingNonCallable from '@/expressions/errors/CallingNonCallable'
import OperatorTypeMismatch from '@/expressions/errors/OperatorTypeMismatch'

import SortBy from '@/expressions/methods/records/SortBy'
import FindBy from '@/expressions/methods/records/FindBy'
import FilterBy from '@/expressions/methods/records/FilterBy'
import Callable from '@/expressions/functions/Callable'
import LowerCase from '@/expressions/methods/strings/LowerCase'

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

    visitGetExpression(expression) {
        const literal = this.evaluate(expression.item)

        if (literal.value instanceof Map) {
            const key = expression.name.lexeme

            if (!literal.value.has(key)) {
                if (key === 'type') {
                    return new Expression.Literal('record')
                } else if (key === 'size') {
                    return new Expression.Literal(literal.value.size)
                } else if (key === 'sortBy') {
                    return new Expression.Literal(new SortBy(literal))
                } else if (key === 'filterBy') {
                    return new Expression.Literal(new FilterBy(literal))
                } else if (key === 'findBy') {
                    return new Expression.Literal(new FindBy(literal))
                } else {
                    return new Expression.Literal(null)
                }
            }

            return new Expression.Literal(literal.value.get(key))
        }

        if (expression.item instanceof Expression.Literal) {
            if (typeof expression.item.value === 'string') {
                if (expression.name.lexeme === 'type') {
                    return new Expression.Literal('string')
                }

                if (expression.name.lexeme === 'lowerCase') {
                    return new Expression.Literal(
                        new LowerCase(expression.item),
                    )
                }
            }

            if (typeof expression.item.value === 'boolean') {
                if (expression.name.lexeme === 'type') {
                    return new Expression.Literal('boolean')
                }
            }

            if (typeof expression.item.value === 'number') {
                if (expression.name.lexeme === 'type') {
                    return new Expression.Literal('number')
                }
            }

            if (expression.item.value === null) {
                throw new NullPropertyAccess(expression.name.lexeme)
            }
        }

        if (expression.item instanceof Expression.Variable) {
            const resolved = this.visitVariableExpression(expression.item)
            const newExpression = { ...expression, item: resolved }

            return this.visitGetExpression(newExpression)
        }

        return new Expression.Literal(null)
    }

    visitCallExpression(expression) {
        const callee = this.evaluate(expression.callee)

        const callable = callee.value

        if (callable === null) {
            throw new NullMethodAccess(expression.callee.name.lexeme)
        }

        if (!(callable instanceof Callable)) {
            throw new CallingNonCallable(getType(callable))
        }

        const args = expression.args.map(argument => {
            return this.evaluate(argument)
        })

        const arity = callable.arity()

        if (!arity.includes(args.length) && !arity.includes(Infinity)) {
            throw new ArityMismatch(
                callable.name(),
                callable.arity(),
                args.length,
            )
        }

        return callable.call(args)
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

                throw new OperatorTypeMismatch(
                    getType(left.value),
                    getType(right.value),
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

    checkNumberOperand(operator, value) {
        if (typeof value === 'number') {
            return
        }

        throw new NonNumberOperand(operator.lexeme, value, getType(value))
    }

    checkNumberOperands(operator, left, right) {
        if (typeof left !== 'number') {
            throw new NonNumberOperand(operator.lexeme, left, getType(left))
        }

        if (typeof right !== 'number') {
            throw new NonNumberOperand(operator.lexeme, right, getType(right))
        }

        return
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
