import { isPlainObject } from 'lodash'

Map.prototype.merge = function (merged) {
	merged.forEach((value, key) => {
		this.set(key, value)
	})

	return this
}

Map.fromObject = object => {
	let entries = Object.entries(object)

	entries = entries.map(entry => {
		if (!isPlainObject(entry[1])) {
			return entry
		}

		return [entry[0], Map.fromObject(entry[1])]
	})

	return new Map(entries)
}
