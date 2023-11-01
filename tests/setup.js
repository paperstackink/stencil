import CompilationError from '@/errors/CompilationError'
import { remove, replace } from 'lodash'

function toThrowCompilationError(error, expected) {
	if (!(error instanceof CompilationError)) {
		return {
			pass: false,
			message: () => "Didn't throw CompilationError",
		}
	}

	if (error.original !== expected.name) {
		return {
			pass: false,
			message: () => "It didn't throw the expected compilation error",
		}
	}

	return {
		pass: true,
	}
}

expect.extend({
	toThrowCompilationError(received, expected) {
		if (typeof received === 'function') {
			try {
				received()

				return {
					pass: true,
				}
			} catch (error) {
				return toThrowCompilationError(error, expected)
			}
		}

		return toThrowCompilationError(received, expected)
	},
})

function removeWhitespace(string) {
	return string.trim().replace(/\s+/g, '')
}

expect.extend({
	toEqualIgnoringWhitespaceAndRegex(received, expected, exceptions) {
		let modified = received
		Object.entries(exceptions).forEach(([replacement, pattern]) => {
			modified = modified.replaceAll(pattern, replacement)
		})

		const pass = removeWhitespace(modified) === removeWhitespace(expected)

		return {
			pass,
			message: pass
				? () =>
						'Expected values to not be equal while ignoring white-space (using ===):\n' +
						`Expected: not  ${expected}\n\n`
				: () => {
						return (
							'Expected values to be equal while ignoring white-space (using ===):\n' +
							`Expected:\n  ${expected}\n\n` +
							`Received:\n  ${modified}`
						)
				  },
		}
	},
})
