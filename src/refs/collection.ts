import { CollectionCreator } from '../types'
import { collection as collection_ } from 'firebase/firestore'

export const collectionCreator: CollectionCreator =
	(fStore, collectionPath) =>
	// @ts-expect-error
	(firestore?) => {
		return collection_(
			// @ts-expect-error
			firestore || fStore,
			collectionPath
		)
	}
