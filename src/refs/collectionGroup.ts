import { MetaType, FirestoreAndFirestoreTesting, Query } from '../types'
import { collectionGroup as collectionGroup_ } from 'firebase/firestore'

export const collectionGroupCreator =
	<T extends MetaType>(
		fStore: FirestoreAndFirestoreTesting,
		collectionID: T['collectionID']
	) =>
	(firestore?: FirestoreAndFirestoreTesting) => {
		return collectionGroup_(
			// @ts-expect-error
			firestore || fStore, // ! testing messed up the type, weird
			collectionID
		) as Query<T>
	}
