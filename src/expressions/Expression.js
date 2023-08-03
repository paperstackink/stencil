class Call {
    constructor(callee, parenthesis, args) {
        this.callee = callee
        this.parenthesis = parenthesis
        this.args = args
    }

    accept(visitor) {
        return visitor.visitCallExpression(this)
    }
}

class Get {
    constructor(item, name) {
        this.item = item
        this.name = name
    }

    accept(visitor) {
        return visitor.visitGetExpression(this)
    }
}

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

class Conditional {
    constructor(condition, left, right) {
        this.condition = condition
        this.left = left
        this.right = right
    }

    accept(visitor) {
        return visitor.visitConditionalExpression(this)
    }
}

class Logical {
    constructor(left, operator, right) {
        this.left = left
        this.operator = operator
        this.right = right
    }

    accept(visitor) {
        return visitor.visitLogicalExpression(this)
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

class Variable {
    constructor(name) {
        this.name = name
    }

    accept(visitor) {
        return visitor.visitVariableExpression(this)
    }
}

export default {
    Get,
    Call,
    Unary,
    Binary,
    Literal,
    Logical,
    Grouping,
    Variable,
    Conditional,
}
