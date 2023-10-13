import CompilationError from '@/errors/CompilationError'

import match from '@/helpers/match'
import NoFrontMatter from '@/errors/NoFrontMatter'
import EmptyFrontmatter from '@/errors/EmptyFrontmatter'
import LoopingNonRecord from '@/errors/LoopingNonRecord'
import NestedExpression from '@/errors/NestedExpression'
import UnclosedExpression from '@/errors/UnclosedExpression'
import UnknownComponentName from '@/errors/UnknownComponentName'
import NoEachDirectiveRecord from '@/errors/NoEachDirectiveRecord'
import ReservedComponentName from '@/errors/ReservedComponentName'
import UnevenIfDirectiveCount from '@/errors/UnevenIfDirectiveCount'
import NoIfDirectiveExpression from '@/errors/NoIfDirectiveExpression'
import NoTemplateInFrontmatter from '@/errors/NoTemplateInFrontmatter'
import NoEachDirectiveVariable from '@/errors/NoEachDirectiveVariable'
import MultipleRootsInComponent from '@/errors/MultipleRootsInComponent'
import ComponentNameNotProvided from '@/errors/ComponentNameNotProvided'
import NodeNestedInsideDataNode from '@/errors/NodeNestedInsideDataNode'
import UnevenEachDirectiveCount from '@/errors/UnevenEachDirectiveCount'
import UnknownTemplateInMarkdown from '@/errors/UnknownTemplateInMarkdown'
import SpreadNonRecordAsAttributes from '@/errors/SpreadNonRecordAsAttributes'
import UnknownDynamicComponentName from '@/errors/UnknownDynamicComponentName'
import MissingEachDirectiveExpression from '@/errors/MissingEachDirectiveExpression'
import NoDefaultSlotInMarkdownTemplate from '@/errors/NoDefaultSlotInMarkdownTemplate'
import InvalidLinkHeadlinesInMarkdownConfig from '@/errors/InvalidLinkHeadlinesInMarkdownConfig'

import ArityMismatch from '@/expressions/errors/ArityMismatch'
import NonNumberOperand from '@/expressions/errors/NonNumberOperand'
import TooManyArguments from '@/expressions/errors/TooManyArguments'
import NullMethodAccess from '@/expressions/errors/NullMethodAccess'
import MissingExpression from '@/expressions/errors/MissingExpression'
import MissingThenClause from '@/expressions/errors/MissingThenClause'
import MissingElseClause from '@/expressions/errors/MissingElseClause'
import UppercaseOperator from '@/expressions/errors/UppercaseOperator'
import CallingNonCallable from '@/expressions/errors/CallingNonCallable'
import UnterminatedString from '@/expressions/errors/UnterminatedString'
import NullPropertyAccess from '@/expressions/errors/NullPropertyAccess'
import UnfinishedOperator from '@/expressions/errors/UnfinishedOperator'
import UnexpectedCharacter from '@/expressions/errors/UnexpectedCharacter'
import OperatorTypeMismatch from '@/expressions/errors/OperatorTypeMismatch'
import UnclosedFunctionCall from '@/expressions/errors/UnclosedFunctionCall'
import UnclosedGroupExpression from '@/expressions/errors/UnclosedGroupExpression'
import UnfinishedPropertyAccess from '@/expressions/errors/UnfinishedPropertyAccess'
import NonStringSortKeyInSortBy from '@/expressions/errors/NonStringSortKeyInSortBy'
import SortingNonRecordsInSortBy from '@/expressions/errors/SortingNonRecordsInSortBy'
import InvalidSortDirectionInSortBy from '@/expressions/errors/InvalidSortDirectionInSortBy'
import SortingMismatchedTypesInSortBy from '@/expressions/errors/SortingMismatchedTypesInSortBy'
import NonStringFieldInFilterFunction from '@/expressions/errors/NonStringFieldInFilterFunction'
import InvalidOperatorInFilterFunction from '@/expressions/errors/InvalidOperatorInFilterFunction'
import NonExistingFieldInFilterFunction from '@/expressions/errors/NonExistingFieldInFilterFunction'
import InvalidContainsValueInFilterFunction from '@/expressions/errors/InvalidContainsValueInFilterFunction'
import InvalidNumberOperatorInFilterFunction from '@/expressions/errors/InvalidNumberOperatorInFilterFunction'

function stringifyArray(array, lastSeparator = 'and', separator = ', ') {
	const last = array.pop()

	return array.join(separator) + ` ${lastSeparator} ` + last
}

function getArticle(type) {
	if (type === 'null') {
		return ''
	}

	return `a `
}

function getType(value) {
	if (value === null) {
		return 'null'
	}

	return typeof value
}

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

function getLinesFromSnippet(snippet) {
	return snippet.split('\n').map((line, index) => ({
		number: index + 1,
		content: line,
	}))
}

function getRelevantLinesFromIndex(input, errorLineNumber) {
	return input
		.split('\n')
		.map((content, index) => {
			const lineNumber = index + 1
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
}

function getRelevantLinesFromLineNumbers(input, start, end) {
	return input
		.split('\n')
		.map((content, index) => ({ number: index + 1, content }))
		.slice(start - 1, end)
}

function getCodeFromLines(lines) {
	return lines
		.map(line => {
			// Find the number of digits in a line number in relevant lines
			// So we can calculate the number of padded spaces we need to add to align all lines
			const maxLineNumberLength = digits(
				Math.max(...lines.map(line => line.number)),
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
}

function getLocationFromPosition(input, path, position) {
	let location = `The error occured in "${path}".`

	if (position) {
		const relevantLines = getRelevantLinesFromLineNumbers(
			input,
			position.start.line,
			position.end.line,
		)
		const codeContext = getCodeFromLines(relevantLines)

		location = `The error occured in "${path}":
${codeContext}`
	}

	return location
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
		const relevantLines = getRelevantLinesFromIndex(
			input,
			error.position.start.line,
		)
		const codeContext = getCodeFromLines(relevantLines)

		const output = `-----  Error: Unknown component name  ----------------------
You tried to use a component called "${error.component}" but there are no components with that name.

The error occured in "${options.path}":
${codeContext}
${suggestions}
`

		return new CompilationError('UnknownComponentName', output)
	} else if (error instanceof NoFrontMatter) {
		const output = `-----  Error: No front matter  ----------------------

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
		const relevantLines = getRelevantLinesFromIndex(
			input,
			error.position.start.line,
		)
		const codeContext = getCodeFromLines(relevantLines)

		const output = `-----  Error: Empty front matter  ----------------------

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

		const codeContext = getCodeFromLines(relevantLines)

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

		const output = `-----  Error: No template specified  ----------------------

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

		const codeContext = getCodeFromLines(relevantLines)

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

		const output = `-----  Error: Unknown template specified  ----------------------

You specified a template "${error.component}" but there are no components with that name.

The error occured in "${options.path}":
${codeContext}
${suggestions}
`

		return new CompilationError('UnknownTemplateInMarkdown', output)
	} else if (error instanceof NoDefaultSlotInMarkdownTemplate) {
		const relevantLines = getLinesFromSnippet(input)
		const codeContext = getCodeFromLines(relevantLines)

		const output = `-----  Error: No slot in template  ----------------------

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
     2 |       title: Value, Price and Profit
     3 |       featured: true
     4 |   </Data>
`,
			Component: `     1 |   <Component is="{{ $name }}" />`,
		})

		const output = `-----  Error: Reserved component name  ----------------------

You have a custom component called "${error.component}", but that is a reserved name.

${explanation}
${example}
`

		return new CompilationError('ReservedComponentName', output)
	} else if (error instanceof NodeNestedInsideDataNode) {
		const relevantLines = getRelevantLinesFromIndex(
			input,
			error.position.start.line,
		)
		const codeContext = getCodeFromLines(relevantLines)

		const output = `-----  Error: Element nested inside Data component  ----------------------

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
		const relevantLines = getRelevantLinesFromIndex(
			input,
			error.position.start.line,
		)
		const codeContext = getCodeFromLines(relevantLines)

		const solution = codeContext.replace(
			'<Component',
			'<Component is="Card"',
		)

		const output = `-----  Error: Missing component name  ----------------------

You tried to use a dynamic component, but didn't specify the name of the component it should render.

The error occured in "${options.path}":
${codeContext}

Try adding an "is" attribute with a component name:
${solution}
`

		return new CompilationError('ComponentNameNotProvided', output)
	} else if (error instanceof SpreadNonRecordAsAttributes) {
		const type = getType(error.value)
		const article = getArticle(type)
		const relevantLines = getRelevantLinesFromIndex(
			input,
			error.position.start.line,
		)
		const codeContext = getCodeFromLines(relevantLines)

		const output = `-----  Error: Spreading ${type}  ----------------------

You tried to spread ${article}"${type}" as attributes, but only records can be spread.

The error occured in "${options.path}":
${codeContext}

Make sure "#bind" contains a record or an expression that evaluates to a record.
`

		return new CompilationError('SpreadNonRecordAsAttributes', output)
	} else if (error instanceof UnknownDynamicComponentName) {
		const name = error.component || 'null'
		const relevantLines = getRelevantLinesFromIndex(
			input,
			error.position.start.line,
		)
		const codeContext = getCodeFromLines(relevantLines)

		const output = `-----  Error: Unknown component  ----------------------

You tried to use a dynamic component with the name "${name}", but that doesn't exist.

The error occured in "${options.path}":
${codeContext}

Make sure you are using the name of one of your components.
`

		return new CompilationError('UnknownDynamicComponentName', output)
	} else if (error instanceof UnclosedExpression) {
		const relevantLines = getRelevantLinesFromIndex(
			input,
			error.position.start.line,
		)
		const codeContext = getCodeFromLines(relevantLines)

		const output = `-----  Error: Unclosed expression  ----------------------

You forgot to close an expression.

The error occured in "${options.path}":
${codeContext}

Make sure to add "}}" after the expression.
`

		return new CompilationError('UnclosedExpression', output)
	} else if (error instanceof NestedExpression) {
		const relevantLines = getRelevantLinesFromIndex(
			input,
			error.position.start.line,
		)
		const codeContext = getCodeFromLines(relevantLines)

		const output = `-----  Error: Nested expression  ----------------------

It seems like you tried to nest an expression inside another expression.

The error occured in "${options.path}":
${codeContext}

Everything between "{{" and "}}" is an expression, so you don't need to use nested brackets.
`

		return new CompilationError('NestedExpression', output)
	} else if (error instanceof UnevenEachDirectiveCount) {
		const relevantLines = getLinesFromSnippet(input)
		const codeContext = getCodeFromLines(relevantLines)

		const output = `-----  Error: Unclosed @each directive  ----------------------

You forgot to close an "@each" directive.

The error occured in "${options.path}":
${codeContext}

"@each" directives can be closed with "@endeach".
`

		return new CompilationError('UnevenEachDirectiveCount', output)
	} else if (error instanceof UnevenIfDirectiveCount) {
		const relevantLines = getLinesFromSnippet(input)
		const codeContext = getCodeFromLines(relevantLines)

		const output = `-----  Error: Unclosed @if directive  ----------------------

You forgot to close an "@if" directive.

The error occured in "${options.path}":
${codeContext}

"@if" directives can be closed with "@endif".
`

		return new CompilationError('UnevenIfDirectiveCount', output)
	} else if (error instanceof MissingEachDirectiveExpression) {
		const relevantLines = getLinesFromSnippet(input)
		const codeContext = getCodeFromLines(relevantLines)

		const output = `-----  Error: Missing expression in @each  ----------------------

You declared an @each loop, but you didn't specify what it should loop over.

The error occured in "${options.path}":
${codeContext}

Try writing the loop like this:
     1 |   @each(identifier in $record)
     2 |       <span>{{ identifier.value }}</span>
     3 |   @endeach
`

		return new CompilationError('MissingEachDirectiveExpression', output)
	} else if (error instanceof NoEachDirectiveVariable) {
		const relevantLines = getLinesFromSnippet(input)
		const codeContext = getCodeFromLines(relevantLines)

		const output = `-----  Error: Missing variable in @each  ----------------------

You declared an @each loop, but you didn't specify a variable to use in the loop.

The error occured in "${options.path}":
${codeContext}

Try writing the loop like this:
     1 |   @each(identifier in $record)
     2 |       <span>{{ identifier.value }}</span>
     3 |   @endeach
`

		return new CompilationError('NoEachDirectiveVariable', output)
	} else if (error instanceof NoEachDirectiveRecord) {
		const relevantLines = getLinesFromSnippet(input)
		const codeContext = getCodeFromLines(relevantLines)

		const output = `-----  Error: Missing record in @each  ----------------------

You declared an @each loop, but you didn't specify a record to to loop over.

The error occured in "${options.path}":
${codeContext}

Try writing the loop like this:
     1 |   @each(identifier in $record)
     2 |       <span>{{ identifier.value }}</span>
     3 |   @endeach
`

		return new CompilationError('NoEachDirectiveRecord', output)
	} else if (error instanceof LoopingNonRecord) {
		const relevantLines = getRelevantLinesFromIndex(
			input,
			error.position.start.line,
		)
		const codeContext = getCodeFromLines(relevantLines)

		const type = getType(error.value)
		const article = getArticle(type)

		const output = `-----  Error: Looping over "${type}"  ----------------------

You tried to loop over ${article}"${type}" in an @each directive.

The error occured in "${options.path}":
${codeContext}

It's only possible to loop over records.
`

		return new CompilationError('LoopingNonRecord', output)
	} else if (error instanceof NoIfDirectiveExpression) {
		const relevantLines = getLinesFromSnippet(input)
		const codeContext = getCodeFromLines(relevantLines)

		const output = `-----  Error: Missing expression in @if  ----------------------

You declared an @if directive, but you didn't specify what it should check.

The error occured in "${options.path}":
${codeContext}

Try writing the @if directive like this:
     1 |   @if(true)
     2 |       <span>Revolutions are the locomotives of history</span>
     3 |   @endif
`

		return new CompilationError('NoIfDirectiveExpression', output)
	} else if (error instanceof MultipleRootsInComponent) {
		const relevantLines = getLinesFromSnippet(error.definition)
		const codeContext = getCodeFromLines(relevantLines)

		const output = `-----  Error: Multiple root nodes in component  ----------------------

You declared multiple root nodes in a component.

The error occured in "${options.path}":
${codeContext}

A component can only have 1 root node. Try wrapping the nodes in a "<div>" or nest one node inside the other.
`

		return new CompilationError('MultipleRootsInComponent', output)
	} else if (error instanceof UnexpectedCharacter) {
		const location = getLocationFromPosition(
			input,
			options.path,
			error.position,
		)

		const output = `-----  Error: Unexpected character  ----------------------

There was an unexpected character "${error.character}" in this expression: "${error.expression}".

${location}
`

		return new CompilationError('UnexpectedCharacter', output)
	} else if (error instanceof UnfinishedOperator) {
		const location = getLocationFromPosition(
			input,
			options.path,
			error.position,
		)

		const output = `-----  Error: Unknown operator  ----------------------

There was an unkown operator "${error.operator}" in this expression: "${error.expression}".

${location}

Did you mean ${error.suggestion}?
`

		return new CompilationError('UnfinishedOperator', output)
	} else if (error instanceof UppercaseOperator) {
		const location = getLocationFromPosition(
			input,
			options.path,
			error.position,
		)

		const output = `-----  Error: Uppercase operator  ----------------------

You tried to use an operator "${
			error.operator
		}"" with uppercase letters in this expression: "${error.expression}".

${location}

All keywords should be lowercase. Try "${error.operator.toLowerCase()}" instead!
`

		return new CompilationError('UppercaseOperator', output)
	} else if (error instanceof UnterminatedString) {
		const location = getLocationFromPosition(
			input,
			options.path,
			error.position,
		)

		const output = `-----  Error: Unterminated string  ----------------------

You added a string in an expression, but it was never terminated: ${error.expression}

${location}
`

		return new CompilationError('UnterminatedString', output)
	} else if (error instanceof TooManyArguments) {
		const location = getLocationFromPosition(
			input,
			options.path,
			error.position,
		)

		const output = `-----  Error: Too many arguments  ----------------------

You added too many arguments to a function call in this expression: ${error.expression}

${location}

You can't have more than 255 arguments in a function call.
`

		return new CompilationError('TooManyArguments', output)
	} else if (error instanceof UnclosedGroupExpression) {
		const location = getLocationFromPosition(
			input,
			options.path,
			error.position,
		)

		const output = `-----  Error: Unclosed parentheses  ----------------------

You forgot to close a pair of parentheses in this expression: ${error.expression}

${location}

Make sure to add ")" to close the group.
`

		return new CompilationError('UnclosedGroupExpression', output)
	} else if (error instanceof UnclosedFunctionCall) {
		const location = getLocationFromPosition(
			input,
			options.path,
			error.position,
		)

		const output = `-----  Error: Unclosed function call  ----------------------

You forgot to close a call to a function in this expression: ${error.expression}

${location}

Make sure to add ")" after the arguments to close function call.
`

		return new CompilationError('UnclosedFunctionCall', output)
	} else if (error instanceof UnfinishedPropertyAccess) {
		const location = getLocationFromPosition(
			input,
			options.path,
			error.position,
		)

		const output = `-----  Error: Unfinished property access  ----------------------

You tried to access a property on a record but didn't specify which property: ${error.expression}

${location}

Make sure to add the name of the property you want to access.
`

		return new CompilationError('UnfinishedPropertyAccess', output)
	} else if (error instanceof MissingExpression) {
		const location = getLocationFromPosition(
			input,
			options.path,
			error.position,
		)

		const output = `-----  Error: Missing expression  ----------------------

It looks like you are missing an expression: ${error.expression}

${location}
`

		return new CompilationError('MissingExpression', output)
	} else if (error instanceof MissingThenClause) {
		const location = getLocationFromPosition(
			input,
			options.path,
			error.position,
		)

		const output = `-----  Error: Missing "then" path  ----------------------

You tried to create an if expression but it's missing a "then" path: ${error.expression}

${location}

Make sure to add a "then" clause that will evaluate when the if expression is truthy.
`

		return new CompilationError('MissingThenClause', output)
	} else if (error instanceof MissingElseClause) {
		const location = getLocationFromPosition(
			input,
			options.path,
			error.position,
		)

		const output = `-----  Error: Missing "else" path  ----------------------

You tried to create an if expression but it's missing a "else" path: ${error.expression}

${location}

Make sure to add a "else" clause that will evaluate when the if expression is falsy.
`

		return new CompilationError('MissingElseClause', output)
	} else if (error instanceof NullPropertyAccess) {
		const location = getLocationFromPosition(
			input,
			options.path,
			error.position,
		)

		const output = `-----  Error: Reading property on "null"  ----------------------

You tried to read the property "${
			error.property
		}" on "null" in this expression: ${error.expression}

${location}

It's likely that "${error.expression.replace(
			`.${error.property}`,
			'',
		)}" wasn't mean to be "null".
`

		return new CompilationError('NullPropertyAccess', output)
	} else if (error instanceof NullMethodAccess) {
		const location = getLocationFromPosition(
			input,
			options.path,
			error.position,
		)

		const indexOfMethod = error.expression.indexOf(`.${error.method}`)

		const output = `-----  Error: Calling method on "null"  ----------------------

You tried to call the method "${error.method}" on "null" in this expression: ${
			error.expression
		}

${location}

It's likely that "${error.expression.slice(
			0,
			indexOfMethod,
		)}" wasn't mean to be "null".
`

		return new CompilationError('NullMethodAccess', output)
	} else if (error instanceof CallingNonCallable) {
		const location = getLocationFromPosition(
			input,
			options.path,
			error.position,
		)

		const output = `-----  Error: Calling non-function  ----------------------

You tried to call "${error.expression}" which is a "${error.type}".

${location}

It's only possible to call methods and functions.
`

		return new CompilationError('CallingNonCallable', output)
	} else if (error instanceof ArityMismatch) {
		const location = getLocationFromPosition(
			input,
			options.path,
			error.position,
		)

		const title =
			error.expected < error.actual
				? 'Too many arguments'
				: 'Too few arguments'

		const expected = stringifyArray(error.expected, 'or')

		const output = `-----  Error: ${title}  ----------------------

You tried to call "${error.method}" with ${error.actual} arguments but it expects ${expected} arguments.

${location}
`

		return new CompilationError('ArityMismatch', output)
	} else if (error instanceof OperatorTypeMismatch) {
		const location = getLocationFromPosition(
			input,
			options.path,
			error.position,
		)

		const output = `-----  Error: Operating on different types  ----------------------

You tried to add a ${error.leftType} and a ${error.rightType} in this expression: ${error.expression}.

${location}

Make sure to add two numbers or two strings.
`

		return new CompilationError('OperatorTypeMismatch', output)
	} else if (error instanceof NonNumberOperand) {
		const location = getLocationFromPosition(
			input,
			options.path,
			error.position,
		)

		const output = `-----  Error: Not a number  ----------------------

You tried to use the numeric operator "${error.operator}" on "${error.value}" which is a ${error.type} in this expression: ${error.expression}.

${location}

Make sure you use numbers when using "${error.operator}".
`

		return new CompilationError('NonNumberOperand', output)
	} else if (error instanceof InvalidOperatorInFilterFunction) {
		const location = getLocationFromPosition(
			input,
			options.path,
			error.position,
		)

		const operators = error.operators
			.map(operator => `     -  ${operator}`)
			.join('\n')

		const output = `-----  Error: Invalid operator  ----------------------

You tried to use "${error.operator}" as an operator in ${error.method}(): ${error.expression}.

${location}

"${error.operator}" is not a valid operator. Here are all the options:
${operators}
`

		return new CompilationError('InvalidOperatorInFilterFunction', output)
	} else if (error instanceof InvalidNumberOperatorInFilterFunction) {
		const location = getLocationFromPosition(
			input,
			options.path,
			error.position,
		)

		const output = `-----  Error: Invalid operator  ----------------------

You used "${error.operator}" as an operator on "${error.field}" in ${error.method}(): ${error.expression}.

${location}

"${error.field}" is a ${error.type} property but "${error.operator}" can only be used on numeric properties.
`

		return new CompilationError(
			'InvalidNumberOperatorInFilterFunction',
			output,
		)
	} else if (error instanceof NonExistingFieldInFilterFunction) {
		const location = getLocationFromPosition(
			input,
			options.path,
			error.position,
		)

		const output = `-----  Error: Property doesn't exist  ----------------------

You tried to check if "${error.field}" contains "${error.value}" in ${error.method}(): ${error.expression}.

${location}

"${error.field}" isn't a property on this record.
`

		return new CompilationError('NonExistingFieldInFilterFunction', output)
	} else if (error instanceof InvalidContainsValueInFilterFunction) {
		const location = getLocationFromPosition(
			input,
			options.path,
			error.position,
		)

		const output = `-----  Error: Invalid operator  ----------------------

You used a "contains" operator on a ${error.type} property in ${error.method}(): ${error.expression}.

${location}

"contains" can only be used on string properties.
`

		return new CompilationError(
			'InvalidContainsValueInFilterFunction',
			output,
		)
	} else if (error instanceof NonStringFieldInFilterFunction) {
		const location = getLocationFromPosition(
			input,
			options.path,
			error.position,
		)

		const output = `-----  Error: Invalid field  ----------------------

You provided a ${error.type} as the "field" in ${error.method}(): ${error.expression}.

${location}

The "field" argument must be a string with the name of the property.
`

		return new CompilationError('NonStringFieldInFilterFunction', output)
	} else if (error instanceof SortingNonRecordsInSortBy) {
		const location = getLocationFromPosition(
			input,
			options.path,
			error.position,
		)

		const output = `-----  Error: Sorting ${error.type}  ----------------------

You tried to sort a record containing a ${error.type} property in sortBy(): ${error.expression}

${location}

The field "${error.property}" has the value "${error.value}"" which is a ${error.type}. 

It's only possible to sort a record of records. If the record contains non-record properties you must filter them out using ${error.method}().
`

		return new CompilationError('SortingNonRecordsInSortBy', output)
	} else if (error instanceof SortingMismatchedTypesInSortBy) {
		const location = getLocationFromPosition(
			input,
			options.path,
			error.position,
		)

		const output = `-----  Error: Sorting different data types  ----------------------

You tried to sort properties with different types in sortBy(): ${error.expression}

${location}

The property "${error.property}" is "${error.firstValue}" (${error.firstType}) in one record and "${error.secondValue}" (${error.secondType}) in another record. 

It's only possible to sort properties with similar types.
`

		return new CompilationError('SortingMismatchedTypesInSortBy', output)
	} else if (error instanceof NonStringSortKeyInSortBy) {
		const location = getLocationFromPosition(
			input,
			options.path,
			error.position,
		)

		const output = `-----  Error: Invalid sort key  ----------------------

You provided a ${error.type} as the sort key in sortBy(): ${error.expression}.

${location}

The "sort key" argument must be a string with the name of a property.
`

		return new CompilationError('NonStringSortKeyInSortBy', output)
	} else if (error instanceof InvalidSortDirectionInSortBy) {
		const location = getLocationFromPosition(
			input,
			options.path,
			error.position,
		)

		const output = `-----  Error: Invalid sort direction  ----------------------

You specified "${error.direction}" as the sort direction in sortBy(): ${error.expression}.

${location}

The sort direction must be either "ascending" or "descending".
`

		return new CompilationError('InvalidSortDirectionInSortBy', output)
	} else if (error instanceof InvalidLinkHeadlinesInMarkdownConfig) {
		const options = error.options
			.map(option => `     -  "${option}"`)
			.join('\n')

		const output = `-----  Error: Invalid config value  ----------------------

You configured "linkHeadlines: '${error.value}'" in "Config/Markdown.js".

"${error.value}" is not a valid value. The valid options are:
${options}
`

		return new CompilationError(
			'InvalidLinkHeadlinesInMarkdownConfig',
			output,
		)
	} else {
		const output = `-----  Error: Internal error  ----------------------

Whoops! Something went wrong while building your site. 

This isn't supposed to happen and it's most likely a bug in Stencil.

It would be a great help if you could file an issue explaining what triggered the error:
https://github.com/paperstackink/stencil/issues/new

Below you'll see the error that occured:

---
${error.stack}
---
`
		return new CompilationError('InternalError', output)
	}
}
