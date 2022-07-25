import { ArrayUnionOrRemove } from '../types'
const arrayFieldValue: keyof ArrayUnionOrRemove<unknown> = `Firelord.ArrayFieldValue`

// remove the property that make field value type inhomogeneous
// also remove the data props if the array field value is empty(if not runtime error)
export const removeFieldValueInhomogeneousProps = <
	T extends Record<string, unknown>
>(
	data: T
) => {
	const replace = (object: Record<string, unknown>) => {
		for (const prop in object) {
			const isArrayFieldValueExist = (
				object[prop] as Record<string, unknown[]>
			)[arrayFieldValue]
			if (isArrayFieldValueExist) {
				delete (object[prop] as Record<string, unknown[]>)[arrayFieldValue]
			}

			const isZero = isArrayFieldValueExist?.length === 0

			if (isZero) {
				delete object[prop] // remove the whole props if array is empty
			} else if (
				typeof object[prop] === 'object' &&
				object[prop] !== null &&
				// https://stackoverflow.com/questions/1173549/how-to-determine-if-an-object-is-an-object-literal-in-javascript
				Object.getPrototypeOf(object[prop]) === Object.prototype
			) {
				replace(object[prop] as Record<string, unknown>)
			}
		}
	}

	replace(data)

	return data
}
