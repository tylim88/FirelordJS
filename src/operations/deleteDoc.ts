import { deleteDoc as deleteDoc_ } from 'firebase/firestore'
import { FirelordFirestore, Delete } from '../types'

export const deleteDoc = ((reference: FirelordFirestore.DocumentReference) => {
	const ref = deleteDoc_(reference)
	return ref
}) as Delete
