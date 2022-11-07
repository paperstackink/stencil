class Unary {
    constructor(operator, expression) {
        this.operator = operator
        this.expression = expression
    }
}

class Binary {
    constructor(left, operator, right) {
        this.left = left
        this.operator = operator
        this.right = right
    }
}

class Literal {
    constructor(value) {
        this.value = value
    }
}

class Grouping {
    constructor(expression) {
        this.expression = expression
    }
}

export default {
    Unary,
    Binary,
    Literal,
    Grouping,
}
