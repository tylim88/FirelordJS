import { arrayRemove as arrayRemove_ } from 'firebase/firestore'
import {
	ArrayUnionOrRemove,
	ErrorArrayFieldValueEmpty,
	arraySymbol,
} from '../types'

/**
Returns a special value that can be used with (setDoc:1) or * updateDoc:1 that tells the server to remove the given elements from any array value that already exists on the server. All instances of each element specified will be removed from the array. If the field being modified is not already an array it will be overwritten with an empty array.

@param elements — The elements to remove from the array.

@returns
The FieldValue sentinel for use in a call to setDoc() or updateDoc()
 */
export const arrayRemove = <Elements extends unknown[]>(
	...elements: Elements extends [] ? [ErrorArrayFieldValueEmpty] : Elements
) => {
	const ref = arrayRemove_(...elements) as ArrayUnionOrRemove<Elements[number]>
	ref['Firelord.ArrayFieldValue'] = elements
	ref['Firelord.FieldValue'] = arraySymbol
	return ref
}
