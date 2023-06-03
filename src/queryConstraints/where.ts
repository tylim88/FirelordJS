import { where as where_ } from 'firebase/firestore'
import { Where } from '../types'

/**
 * Creates a  QueryConstraint that enforces that documents must contain the
 * specified field and that the value should satisfy the relation constraint
 * provided.
 *
 * @param fieldPath - The path to compare
 * @param opStr - The operation string (e.g "&lt;", "&lt;=", "==", "&lt;",
 *   "&lt;=", "!=").
 * @param value - The value for comparison
 * @returns The created Query.
 */
// @ts-expect-error
export const where: Where = (fieldPath, opStr, value) => {
	let newValue = value
	if (
		Array.isArray(newValue) &&
		(opStr === 'in' || opStr === 'array-contains-any' || opStr === 'not-in') &&
		newValue.length === 0
	) {
		newValue = [
			'712zy78yn73x8y037zym83y1x82y3n8cy38u89zul,98kup3c289	2unp38yn8nyz83ym073`yzmo7cyun8z90 ,u2e8 ' +
				Date.now().toLocaleString(),
		] as typeof newValue
	}

	return {
		fieldPath,
		opStr,
		value,
		ref: where_(fieldPath, opStr, newValue),
	}
}
