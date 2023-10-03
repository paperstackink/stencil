import CompilationError from '@/errors/CompilationError'

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
