import RuntimeError from '@/expressions/errors/RuntimeError'
import InternalError from '@/expressions/errors/InternalError'

class Interpreter {
    constructor(ast) {
        this.ast = ast
    }

    interpret() {
        // try {
        const output = this.evaluate(this.ast)

        return output
        // } catch (error) {
        //     // Runtime error
        //     throw new Errorr(error)
        // }
    }

    visitLiteralExpression(expression) {
        return expression.value
    }

    visitGroupingExpression(expression) {
        return this.evaluate(expression.expression)
    }

    visitUnaryExpression(expression) {
        const result = this.evaluate(expression.expression)

        switch (expression.operator.type) {
            case 'NOT': {
                return !this.isTruthy(result)
            }
            case 'MINUS': {
                this.checkNumberOperand(expression.operator, result)
                return -Number(result)
            }
        }

        throw new InternalError('Unexpected end of unary expression.')
    }

    visitBinaryExpression(expression) {
        const left = this.evaluate(expression.left)
        const right = this.evaluate(expression.right)

        switch (expression.operator.type) {
            case 'NOT_EQUAL':
            case 'GREATER':
            case 'GREATER_EQUALS':
            case 'LESS':
            case 'LESS_EQUALS':
            case 'IS': {
                throw new InternalError('Not implemented.')
            }
            case 'MINUS': {
                this.checkNumberOperands(expression.operator, left, right)

                return Number(left) - Number(right)
            }
            case 'PLUS': {
                if (typeof left === 'number' && typeof right === 'number') {
                    return Number(left) + Number(right)
                }

                if (typeof left === 'string' && typeof right === 'string') {
                    return String(left) + String(right)
                }

                throw new RuntimeError(
                    'Operands must be two numbers or two strings',
                )
            }
            case 'SLASH': {
                this.checkNumberOperands(expression.operator, left, right)

                return Number(left) / Number(right)
            }
            case 'STAR': {
                this.checkNumberOperands(expression.operator, left, right)

                return Number(left) * Number(right)
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
