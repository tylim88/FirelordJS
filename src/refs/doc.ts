import { DocCreator } from '../types'
import { doc as doc_, getFirestore } from 'firebase/firestore'
import { isFirestore } from '../utils'
import { buildPathFromColIDsAndDocIDs } from './utils'

export const docCreator: DocCreator =
	(fStore, ...collectionIDs) =>
	// @ts-expect-error
	(firestore, ...documentIds) => {
		const fs = isFirestore(firestore) ? firestore : fStore
		const docIDs = isFirestore(firestore)
			? documentIds
			: [firestore, ...documentIds]
		return doc_(
			// @ts-expect-error
			fs || getFirestore(),
			buildPathFromColIDsAndDocIDs({
				collectionIDs,
				// @ts-expect-error
				documentIDs: docIDs,
			})
		)
	}
