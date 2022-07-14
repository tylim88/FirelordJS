import { deleteDoc as deleteDoc_ } from 'firebase/firestore'
import { FirelordFirestore, Delete } from '../types'

export const deleteDoc = ((
	reference: FirelordFirestore.OriDocumentReference
) => {
	const ref = deleteDoc_(reference)
	return ref
}) as unknown as Delete
