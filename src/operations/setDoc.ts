import { Set } from '../types'
import { setDoc as setDoc_ } from 'firebase/firestore'
import { removeFieldValueInhomogeneousProps } from '../fieldValue'

/**
 * Writes to the document referred to by the specified `DocumentReference`. If
 * the document does not yet exist, it will be created. If you provide `merge`
 * or `mergeFields`, the provided data can be merged into an existing document.
 *
 * @param reference - A reference to the document to write.
 * @param data - A map of the fields and values for the document.
 * @param options - optional, an object to configure the set behavior.
 * @returns A Promise resolved once the data has been successfully written
 * to the backend (note that it won't resolve while you're offline).
 */
export const setDoc: Set = (reference, data, options?) => {
	return setDoc_(
		// @ts-expect-error
		reference,
		removeFieldValueInhomogeneousProps(data),
		options || {}
	)
}
