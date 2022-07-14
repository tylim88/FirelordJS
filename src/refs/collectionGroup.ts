import { MetaType, FirelordFirestore, Query } from '../types'
import { collectionGroup as collectionGroup_ } from 'firebase/firestore'

export const collectionGroupCreator =
	<T extends MetaType>(
		fStore: FirelordFirestore.OriFirestore,
		collectionID: T['collectionID']
	) =>
	(firestore?: FirelordFirestore.OriFirestore) => {
		return collectionGroup_(
			// @ts-expect-error
			firestore || fStore, // ! type messed up, after adding firestore of testing type, weird
			collectionID as string
		) as unknown as Query<T>
	}
