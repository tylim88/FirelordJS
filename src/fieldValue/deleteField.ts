import { deleteField as deleteField_ } from 'firebase/firestore'
import { DeleteField } from '../types'

/**
Returns a sentinel for use with @firebase/firestore/lite#(updateDoc:1) or @firebase/firestore/lite#(setDoc:1) with {merge: true} to mark a field for deletion.
 */
export const deleteField = () => {
	const ref = deleteField_() as DeleteField
	return ref
}
