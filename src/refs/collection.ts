import { MetaType, CollectionReference, Firestore } from '../types'
import { collection as collection_ } from 'firebase/firestore'

export const collectionCreator =
	<T extends MetaType>(
		fStore: Firestore,
		collectionPath: T['collectionPath']
	) =>
	(firestore?: Firestore) => {
		return collection_(
			// @ts-expect-error
			firestore || fStore, // ! testing messed up the type, weird
			collectionPath
		) as CollectionReference<T>
	}
