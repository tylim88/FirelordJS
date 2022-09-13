import { CollectionCreator } from '../types'
import { collection as collection_ } from 'firebase/firestore'
import { buildPathFromColIDsAndDocIDs } from './utils'
import { isFirestore } from '../utils'

export const collectionCreator: CollectionCreator =
	(fStore, ...collectionIDs) =>
	// @ts-expect-error
	(firestore, ...documentIDs) => {
		const fs = isFirestore(firestore) ? firestore : fStore
		const docIDs = isFirestore(firestore)
			? documentIDs
			: [firestore, ...documentIDs]
		return collection_(
			// @ts-expect-error
			fs,
			buildPathFromColIDsAndDocIDs({
				collectionIDs,
				// @ts-expect-error
				documentIDs: docIDs,
			})
		)
	}
