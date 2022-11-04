class Token {
    constructor(type, lexeme, literal, position) {
        this.type = type
        this.lexeme = lexeme
        this.literal = literal
        this.position = position
    }
}

export default Token
