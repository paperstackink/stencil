import { v4 as uuid } from 'uuid'

export function id() {
	return `id-${uuid()}`
}
