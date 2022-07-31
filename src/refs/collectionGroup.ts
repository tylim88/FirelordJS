import { MetaType, Firestore, Query } from '../types'
import { collectionGroup as collectionGroup_ } from 'firebase/firestore'

export const collectionGroupCreator =
	<T extends MetaType>(fStore: Firestore, collectionID: T['collectionID']) =>
	(firestore?: Firestore) => {
		return collectionGroup_(
			// @ts-expect-error
			firestore || fStore, // ! testing messed up the type, weird
			collectionID
		) as Query<T>
	}
