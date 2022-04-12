import { MetaType, CollectionReference, FirelordFirestore } from '../types'
import { collection as collection_ } from 'firebase/firestore'

export const collectionCreator =
	<T extends MetaType>(
		fStore: FirelordFirestore.Firestore,
		collectionPath: T['collectionPath']
	) =>
	(firestore?: FirelordFirestore.Firestore) => {
		return collection_(
			// @ts-expect-error
			firestore || fStore, // ! type messed up, after adding firestore of testing type, weird
			collectionPath as string
		) as unknown as CollectionReference<T>
	}
