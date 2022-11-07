import Parser from '@/expressions/Parser'
import Tokenizer from '@/expressions/Tokenizer'
import OperatorParser from '@/expressions/OperatorParser'

// const input = 'greater than or equals'
const input = '(-1 + 2) * 3'
const tokenizer = new Tokenizer(input)
const tokens = tokenizer.scanTokens()
// console.log(tokens)

// const operatorParser = new OperatorParser(tokens)
// const newTokens = operatorParser.parse()
// console.log(newTokens)

const parser = new Parser(tokens)
const output = parser.parse()

console.log(output)
