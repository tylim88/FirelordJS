import { MetaType, FirelordFirestore, Query } from '../types'
import { collectionGroup as collectionGroup_ } from 'firebase/firestore'

export const collectionGroupCreator =
	<T extends MetaType>(
		fStore: FirelordFirestore.Firestore,
		collectionID: T['collectionID']
	) =>
	(firestore?: FirelordFirestore.Firestore) => {
		return collectionGroup_(
			firestore || fStore,
			collectionID as string
		) as Query<T>
	}
