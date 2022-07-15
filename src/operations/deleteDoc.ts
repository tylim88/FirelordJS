import { deleteDoc as deleteDoc_ } from 'firebase/firestore'
import { OriDocumentReference, Delete } from '../types'

export const deleteDoc = ((reference: OriDocumentReference) => {
	const ref = deleteDoc_(reference)
	return ref
}) as unknown as Delete
