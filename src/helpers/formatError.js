import CompilationError from '@/errors/CompilationError'

import match from '@/helpers/match'

import NoFrontMatter from '@/errors/NoFrontMatter'
import EmptyFrontmatter from '@/errors/EmptyFrontmatter'
import NestedExpression from '@/errors/NestedExpression'
import UnclosedExpression from '@/errors/UnclosedExpression'
import UnknownComponentName from '@/errors/UnknownComponentName'
import ReservedComponentName from '@/errors/ReservedComponentName'
import NoTemplateInFrontmatter from '@/errors/NoTemplateInFrontmatter'
import ComponentNameNotProvided from '@/errors/ComponentNameNotProvided'
import NodeNestedInsideDataNode from '@/errors/NodeNestedInsideDataNode'
import UnevenEachDirectiveCount from '@/errors/UnevenEachDirectiveCount'
import UnknownTemplateInMarkdown from '@/errors/UnknownTemplateInMarkdown'
import SpreadNonRecordAsAttributes from '@/errors/SpreadNonRecordAsAttributes'
import UnknownDynamicComponentName from '@/errors/UnknownDynamicComponentName'
import NoDefaultSlotInMarkdownTemplate from '@/errors/NoDefaultSlotInMarkdownTemplate'

Array.prototype.insert = function (index) {
	this.splice.apply(
		this,
		[index, 0].concat(Array.prototype.slice.call(arguments, 1)),
	)
	return this
}

function getCharacterDiffCount(a, b) {
	return a.split('').filter((character, index) => {
		return character !== b.charAt(index)
	}).length
}

function digits(number) {
	return number.toString().length
}

export default function (input, error, options, context) {
	if (error instanceof UnknownComponentName) {
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

				const beginning = `${line.number}`.padStart(5)

				return `${beginning} | ${line.content}`
			})
			.join('\n')

		const output = `
-----  Error: Unknown component name  ----------------------
You tried to use a component called "${error.component}" but there are no components with that name.

The error occured in "${options.path}":
${codeContext}
${suggestions}
`

		return new CompilationError('UnknownComponentName', output)
	} else if (error instanceof NoFrontMatter) {
		const output = `
-----  Error: No front matter  ----------------------

You didn't include a front matter block in "${options.path}".

When creating a markdown page it's required to specify a 'template':
    1 |   ---
    2 |   template: Base
    3 |   ---
    4 |
    5 |   # Headline 1
`
		return new CompilationError('NoFrontMatter', output)
	} else if (error instanceof EmptyFrontmatter) {
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

				const beginning = `${line.number}`.padStart(5)

				return `${beginning} |   ${line.content}`
			})
			.join('\n')

		const output = `
-----  Error: Empty front matter  ----------------------

You included an empty front matter block in "${options.path}":
${codeContext}

When creating a markdown page it's required to specify a 'template':
    1 |   ---
    2 |   template: Base
    3 |   ---
`

		return new CompilationError('EmptyFrontmatter', output)
	} else if (error instanceof NoTemplateInFrontmatter) {
		const openingFrontMatterLineIndex = 0
		const closingFrontMatterLineIndex =
			input
				.split('\n')
				.slice(1)
				.findIndex(line => line.startsWith('---')) + 1

		const relevantLines = input
			.split('\n')
			.filter(
				(_, index) =>
					index >= openingFrontMatterLineIndex &&
					index <= closingFrontMatterLineIndex,
			)
			.map((content, index) => ({ number: index + 1, content }))

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

				const beginning = `${line.number}`.padStart(5)

				return `${beginning} |   ${line.content}`
			})
			.join('\n')

		const suggestion = relevantLines
			.insert(1, { content: 'template: Base' })
			.map((item, index) => ({ ...item, number: index + 1 }))
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

				const beginning = `${line.number}`.padStart(5)

				return `${beginning} |   ${line.content}`
			})
			.join('\n')

		const output = `
-----  Error: No template specified  ----------------------

You didn't specify a template in "${options.path}":
${codeContext}

It's required to configure a 'template' in markdown pages:
${suggestion}
`

		return new CompilationError('NoTemplateInFrontmatter', output)
	} else if (error instanceof UnknownTemplateInMarkdown) {
		const openingFrontMatterLineIndex = 0
		const closingFrontMatterLineIndex =
			input
				.split('\n')
				.slice(1)
				.findIndex(line => line.startsWith('---')) + 1

		const relevantLines = input
			.split('\n')
			.filter(
				(_, index) =>
					index >= openingFrontMatterLineIndex &&
					index <= closingFrontMatterLineIndex,
			)
			.map((content, index) => ({ number: index + 1, content }))

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

				const beginning = `${line.number}`.padStart(5)

				return `${beginning} |   ${line.content}`
			})
			.join('\n')

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

		const output = `
-----  Error: Unknown template specified  ----------------------

You specified a template "${error.component}" but there are no components with that name.

The error occured in "${options.path}":
${codeContext}
${suggestions}
`

		return new CompilationError('UnknownTemplateInMarkdown', output)
	} else if (error instanceof NoDefaultSlotInMarkdownTemplate) {
		const relevantLines = input.split('\n').map((content, index) => {
			const lineNumber = index + 1

			return {
				number: lineNumber,
				content,
			}
		})

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

				const beginning = `${line.number}`.padStart(5)

				return `${beginning} |   ${line.content}`
			})
			.join('\n')

		const output = `
-----  Error: No slot in template  ----------------------

Your template doesn't contain a "<slot />" element, which is used to render your content.

The error occured in "${options.path}":
${codeContext}

Try adding a "<slot />" component somewhere in "${options.path}"
`

		return new CompilationError('NoDefaultSlotInMarkdownTemplate', output)
	} else if (error instanceof ReservedComponentName) {
		const explanation = match(error.component, {
			Data: `"<Data>" is used to add extra data to a page with Yaml:`,
			Component: `"<Component>" is used to dynamically render another component:`,
		})
		const example = match(error.component, {
			Data: `     1 |   <Data>
     2 |       title: My Beautiful Dark Twisted Fantasy
     3 |       featured: true
     4 |   </Data>
`,
			Component: `     1 |   <Component is="{{ $name }}" />`,
		})

		const output = `
-----  Error: Reserved component name  ----------------------

You have a custom component called "${error.component}", but that is a reserved name.

${explanation}
${example}
`

		return new CompilationError('ReservedComponentName', output)
	} else if (error instanceof NodeNestedInsideDataNode) {
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

				const beginning = `${line.number}`.padStart(5)

				return `${beginning} |   ${line.content}`
			})
			.join('\n')

		const output = `
-----  Error: Element nested inside Data component  ----------------------

You nested an element inside the '<Data>' component, but it should only contain yaml.

The error occured in "${options.path}":
${codeContext}

Try adding yaml inside the '<Data>':
    1 |   <Data>
    2 |       template: Base
    3 |       featured: true
    4 |   </Data>
`

		return new CompilationError('NodeNestedInsideDataNode', output)
	} else if (error instanceof ComponentNameNotProvided) {
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

				const beginning = `${line.number}`.padStart(5)

				return `${beginning} |   ${line.content}`
			})
			.join('\n')

		const solution = codeContext.replace(
			'<Component',
			'<Component is="Card"',
		)

		const output = `
-----  Error: Missing component name  ----------------------

You tried to use a dynamic component, but didn't specify the name of the component it should render.

The error occured in "${options.path}":
${codeContext}

Try adding an "is" attribute with a component name:
${solution}
`

		return new CompilationError('ComponentNameNotProvided', output)
	} else if (error instanceof SpreadNonRecordAsAttributes) {
		function getType(value) {
			if (value === null) {
				return 'null'
			}

			return typeof value
		}

		const type = getType(error.value)

		function getArticle(type) {
			if (type === 'null') {
				return ''
			}

			return `a `
		}

		const article = getArticle(type)

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

				const beginning = `${line.number}`.padStart(5)

				return `${beginning} |   ${line.content}`
			})
			.join('\n')

		const output = `
-----  Error: Spreading ${type}  ----------------------

You tried to spread ${article}"${type}" as attributes, but only records can be spread.

The error occured in "${options.path}":
${codeContext}

Make sure "#bind" contains a record or an expression that evaluates to a record.
`

		return new CompilationError('SpreadNonRecordAsAttributes', output)
	} else if (error instanceof UnknownDynamicComponentName) {
		const name = error.component || 'null'

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

				const beginning = `${line.number}`.padStart(5)

				return `${beginning} |   ${line.content}`
			})
			.join('\n')

		const output = `
-----  Error: Unknown component  ----------------------

You tried to use a dynamic component with the name "${name}", but that doesn't exist.

The error occured in "${options.path}":
${codeContext}

Make sure you are using the name of one of your components.
`

		return new CompilationError('UnknownDynamicComponentName', output)
	} else if (error instanceof UnclosedExpression) {
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

				const beginning = `${line.number}`.padStart(5)

				return `${beginning} |   ${line.content}`
			})
			.join('\n')

		const output = `
-----  Error: Unclosed expression  ----------------------

You forgot to close an expression.

The error occured in "${options.path}":
${codeContext}

Make sure to add "}}" after the expression.
`

		return new CompilationError('UnclosedExpression', output)
	} else if (error instanceof NestedExpression) {
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

				const beginning = `${line.number}`.padStart(5)

				return `${beginning} |   ${line.content}`
			})
			.join('\n')

		const output = `
-----  Error: Nested expression  ----------------------

It seems like you tried to nest an expression inside another expression.

The error occured in "${options.path}":
${codeContext}

Everything between "{{" and "}}" is an expression, so you don't need to use nested brackets.
`

		return new CompilationError('NestedExpression', output)
	} else if (error instanceof UnevenEachDirectiveCount) {
		const relevantLines = input.split('\n').map((line, index) => ({
			number: index + 1,
			content: line,
		}))
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

				const beginning = `${line.number}`.padStart(5)

				return `${beginning} |   ${line.content}`
			})
			.join('\n')

		const output = `
-----  Error: Unclosed @each directive  ----------------------

You forgot to close an "@each" directive.

The error occured in "${options.path}":
${codeContext}

"@each" directives can be closed with "@endeach".
`

		return new CompilationError('UnevenEachDirectiveCount', output)
	} else {
		return error
	}
}
