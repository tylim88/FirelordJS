import { MetaTypes, CollectionReference, FirelordFirestore } from '../types'

export const collectionCreator =
	<T extends MetaTypes>(
		collection: FirelordFirestore.Collection,
		firestore: FirelordFirestore.Firestore,
		collectionPath: T['collectionPath']
	) =>
	() => {
		const ref = collection(firestore, collectionPath)

		return ref as CollectionReference<T>
	}
