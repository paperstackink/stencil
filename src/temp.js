import Parser from '@/expressions/Parser'
import Tokenizer from '@/expressions/Tokenizer'
import Interpreter from '@/expressions/Interpreter'
import OperatorParser from '@/expressions/OperatorParser'

// const input = 'greater than or equals'
const input = 'x'
const tokenizer = new Tokenizer(input)
const tokens = tokenizer.scanTokens()
// console.log(tokens)

// const operatorParser = new OperatorParser(tokens)
// const newTokens = operatorParser.parse()
// console.log(newTokens)

const parser = new Parser(tokens)
const ast = parser.parse()

// console.log(ast)

const interpreter = new Interpreter(ast, {
    x: 'Yo this is a variable',
})
const output = interpreter.interpret()

console.log(output)
