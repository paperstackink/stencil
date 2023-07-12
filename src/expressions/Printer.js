class Printer {
    constructor(expression) {
        this.expression = expression
    }

    print() {
        return this.expression.accept(this)
    }

    visitLiteralExpression(expression) {
        if (expression.value === null) {
            return ''
        }

        return String(expression.value)
    }
}

export default Printer
