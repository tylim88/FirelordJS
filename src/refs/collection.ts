import { MetaType, CollectionReference, FirelordFirestore } from '../types'
import { collection as collection_ } from 'firebase/firestore'

export const collectionCreator =
	<T extends MetaType>(
		fStore: FirelordFirestore.OriFirestore,
		collectionPath: T['collectionPath']
	) =>
	(firestore?: FirelordFirestore.OriFirestore) => {
		return collection_(
			// @ts-expect-error
			firestore || fStore, // ! type messed up, after adding firestore of testing type, weird
			collectionPath as string
		) as unknown as CollectionReference<T>
	}
