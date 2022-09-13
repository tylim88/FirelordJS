import { CollectionGroupCreator } from '../types'
import {
	collectionGroup as collectionGroup_,
	getFirestore,
} from 'firebase/firestore'

export const collectionGroupCreator: CollectionGroupCreator =
	(fStore, collectionID) => (firestore?) => {
		return collectionGroup_(
			// @ts-expect-error
			firestore || fStore || getFirestore(),
			collectionID
		)
	}
