import CompilationError from '@/errors/CompilationError'
import NoFrontMatterError from '@/errors/NoFrontMatterError'
import UnknownComponentNameError from '@/errors/UnknownComponentNameError'

import isWhitespace from '@/helpers/isWhitespace'

function getCharacterDiffCount(a, b) {
	return a.split('').filter((character, index) => {
		return character !== b.charAt(index)
	}).length
}

function digits(number) {
	return number.toString().length
}

export default function (input, error, options, context) {
	if (error instanceof UnknownComponentNameError) {
		const componentNames = Object.keys(context.components)
		const suggestedComponents = componentNames.filter(
			name =>
				getCharacterDiffCount(error.component, name) === 1 &&
				getCharacterDiffCount(name, error.component) === 1,
		)

		const suggestions = suggestedComponents.length
			? `\nIt might be one of these components instead:\n` +
			  suggestedComponents.map(name => `     ${name}`).join('\n')
			: ''

		const relevantLines = input
			.split('\n')
			.map((content, index) => {
				const lineNumber = index + 1
				const errorLineNumber = error.position.start.line
				const diff = lineNumber - errorLineNumber
				if (diff === 0 || Math.abs(diff) === 1) {
					return {
						number: lineNumber,
						content,
					}
				} else {
					return null
				}
			})
			.filter(Boolean)
		const codeContext = relevantLines
			.map(line => {
				// Find the number of digits in a line number in relevant lines
				// So we can calculate the number of padded spaces we need to add to align all lines
				const maxLineNumberLength = digits(
					Math.max(...relevantLines.map(line => line.number)),
				)
				const lineNumberLength = digits(line.number)
				const padding = Array.from(
					new Array(maxLineNumberLength - lineNumberLength + 1),
				)
					.map(_ => ' ')
					.join('')

				return `${line.number}${padding}| ${line.content}`
			})
			.join('\n')

		const output = `
-----  Error: Unknown component name  ----------------------
You tried to use a component called "${error.component}" but there are no components with that name.

The error occured in "${options.path}":
${codeContext}
${suggestions}
`

		return new CompilationError(output)
	} else if (error instanceof NoFrontMatterError) {
		const context = !isWhitespace(input)
			? input.split('\n').slice(0, 3).join('\n')
			: '# Headline 1'

		const output = `
-----  Error: No front matter  ----------------------
You didn't include any front matter in "${options.path}".

When creating a markdown page it's required to specify a 'template':

---
template: Base
---

${context}
`
		return new CompilationError(output)
	} else {
		return error
	}
}
