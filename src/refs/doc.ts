import { DocCreator } from '../types'
import { doc as doc_ } from 'firebase/firestore'
import { isFirestore } from '../utils'

export const docCreator: DocCreator =
	(fStore, collectionPath) =>
	// @ts-expect-error
	(firestore, documentId) => {
		const fs = isFirestore(firestore) ? firestore : fStore
		const docId = isFirestore(firestore) ? documentId : firestore
		return doc_(
			// @ts-expect-error
			fs, // ! testing messed up the type, weird
			collectionPath + '/' + docId
		)
	}
