export function getType(value) {
	if (value instanceof Map) {
		return 'record'
	}

	if (value instanceof Date) {
		return 'date'
	}

	return typeof value
}
