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
			firestore || fStore, // ! type messed up, after adding firestore of testing type, weird
			collectionID
		) as Query<T>
	}
