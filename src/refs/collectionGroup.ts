import { MetaType, OriFirestore, Query } from '../types'
import { collectionGroup as collectionGroup_ } from 'firebase/firestore'

export const collectionGroupCreator =
	<T extends MetaType>(fStore: OriFirestore, collectionID: T['collectionID']) =>
	(firestore?: OriFirestore) => {
		return collectionGroup_(
			// @ts-expect-error
			firestore || fStore, // ! type messed up, after adding firestore of testing type, weird
			collectionID
		) as unknown as Query<T>
	}
