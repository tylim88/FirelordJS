import { MetaTypes, FirelordFirestore, Query } from '../types'

export const collectionGroupCreator =
	<T extends MetaTypes>(
		collectionGroup: FirelordFirestore.CollectionGroup,
		firestore: FirelordFirestore.Firestore,
		collectionID: T['collectionID']
	) =>
	() => {
		const ref = collectionGroup(firestore, collectionID)

		return ref as Query<T>
	}
