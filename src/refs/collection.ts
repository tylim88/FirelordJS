import { MetaType, CollectionReference, OriFirestore } from '../types'
import { collection as collection_ } from 'firebase/firestore'

export const collectionCreator =
	<T extends MetaType>(
		fStore: OriFirestore,
		collectionPath: T['collectionPath']
	) =>
	(firestore?: OriFirestore) => {
		return collection_(
			// @ts-expect-error
			firestore || fStore, // ! type messed up, after adding firestore of testing type, weird
			collectionPath
		) as unknown as CollectionReference<T>
	}
