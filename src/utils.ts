import { Firelord } from './firelord'
import { FirelordFirestore } from './firelordFirestore'

export const flatten = <T extends Record<string, unknown>>(object: T) => {
	let obj = {}

	const flat = (object: Record<string, unknown>, key: string) => {
		for (const prop in object) {
			const newKey = (key ? key + '.' : key) + prop
			if (
				!Array.isArray(object[prop]) &&
				typeof object[prop] === 'object' &&
				object[prop] !== null &&
				!Object.getOwnPropertyNames(
					Object.getPrototypeOf(object[prop])
				).includes('constructor')
				// !Object.keys(exclude).includes(prop)
			) {
				flat(object[prop] as Record<string, unknown>, newKey)
			} else {
				obj = { ...obj, [newKey]: object[prop] }
			}
		}
	}

	flat(object, '')

	return obj as Firelord.FlattenObject<T>
}

export const createTime = (firestore: FirelordFirestore.Firestore) => {
	const time = firestore.FieldValue.serverTimestamp()

	return {
		updatedAt: { updatedAt: time },
		createdAt: {
			createdAt: time,
			updatedAt: null,
		},
	}
}

export const arrayChunk = <T>(input: T[], maxLength: number) => {
	if (!Array.isArray(input)) {
		throw new TypeError('Expected an array to split')
	}

	if (typeof maxLength !== 'number') {
		throw new TypeError('Expected a number of groups to split the array in')
	}

	const result = []
	let part = []

	for (let i = 0; i < input.length; i++) {
		part.push(input[i])

		// check if we reached the maximum amount of items in a partial
		// or just if we reached the last item
		if (part.length === maxLength || i === input.length - 1) {
			result.push(part)
			part = []
		}
	}

	return result
}
