export function getType(value) {
	if (value instanceof Map) {
		return 'record'
	}

	return typeof value
}
