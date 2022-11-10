class Unary {
    constructor(operator, expression) {
        this.operator = operator
        this.expression = expression
    }

    accept(visitor) {
        return visitor.visitUnaryExpression(this)
    }
}

class Binary {
    constructor(left, operator, right) {
        this.left = left
        this.operator = operator
        this.right = right
    }

    accept(visitor) {
        return visitor.visitBinaryExpression(this)
    }
}

class Literal {
    constructor(value) {
        this.value = value
    }

    accept(visitor) {
        return visitor.visitLiteralExpression(this)
    }
}

class Grouping {
    constructor(expression) {
        this.expression = expression
    }

    accept(visitor) {
        return visitor.visitGroupingExpression(this)
    }
}

export default {
    Unary,
    Binary,
    Literal,
    Grouping,
}
