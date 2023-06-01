import { CollectionGroupCreator } from '../types'
import { collectionGroup } from 'firebase/firestore'

export const collectionGroupCreator: CollectionGroupCreator =
	// @ts-expect-error
	(fStore, collectionID) => () => {
		return collectionGroup(
			// @ts-expect-error
			fStore,
			collectionID
		)
	}
