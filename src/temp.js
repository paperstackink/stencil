import Tokenizer from '@/expressions/Tokenizer'

const input = 'greater than or equals'
const tokenizer = new Tokenizer(input)
const output = tokenizer.scanTokens()

console.log(output)
