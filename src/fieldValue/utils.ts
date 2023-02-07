import { ArrayUnionOrRemove } from '../types'
const arrayFieldValue: keyof ArrayUnionOrRemove<unknown> = `Firelord.ArrayFieldValue`

// remove the property that make field value type inhomogeneous
// also remove the data props if the array field value is empty(if not runtime error)
export const removeFieldValueInhomogeneousProps = <
	T extends Record<string, unknown>
>(
	data: T
) => {
	for (const prop in data) {
		const isArrayFieldValueExist = (data[prop] as Record<string, unknown[]>)?.[
			arrayFieldValue
		]
		if (isArrayFieldValueExist) {
			delete (data[prop] as Record<string, unknown[]>)[arrayFieldValue]
		}

		const isZero = isArrayFieldValueExist?.length === 0

		if (isZero) {
			delete data[prop] // remove the whole props if array is empty
		} else if (
			typeof data[prop] === 'object' &&
			data[prop] !== null &&
			// https://stackoverflow.com/questions/1173549/how-to-determine-if-an-object-is-an-object-literal-in-javascript
			Object.getPrototypeOf(data[prop]) === Object.prototype
		) {
			removeFieldValueInhomogeneousProps(data[prop] as Record<string, unknown>)
		}
	}
	return data
}
