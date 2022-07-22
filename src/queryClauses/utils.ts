import crypto from 'crypto'

export const handleEmptyArray = (arr: unknown[]) => {
	return arr.length === 0
		? [crypto.randomUUID() + crypto.randomUUID() + crypto.randomUUID()]
		: arr
}
