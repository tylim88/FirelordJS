import { CollectionGroupCreator } from '../types'
import { collectionGroup as collectionGroup_ } from 'firebase/firestore'

export const collectionGroupCreator: CollectionGroupCreator =
	(fStore, collectionID) => () => {
		return collectionGroup_(
			// @ts-expect-error
			fStore,
			collectionID
		)
	}
