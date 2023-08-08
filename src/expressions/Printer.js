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

        if (expression.value instanceof Map) {
            return JSON.stringify(
                expression.value,
                (key, value) => {
                    if (!(value instanceof Map)) {
                        return value
                    }

                    const object = {}

                    value.forEach((value, key) => {
                        object[key] = value
                    })

                    return object
                },
                2,
            )
        }

        return String(expression.value)
    }
}

export default Printer
