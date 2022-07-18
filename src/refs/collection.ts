import {
	MetaType,
	CollectionReference,
	FirestoreAndFirestoreTesting,
} from '../types'
import { collection as collection_ } from 'firebase/firestore'

export const collectionCreator =
	<T extends MetaType>(
		fStore: FirestoreAndFirestoreTesting,
		collectionPath: T['collectionPath']
	) =>
	(firestore?: FirestoreAndFirestoreTesting) => {
		return collection_(
			// @ts-expect-error
			firestore || fStore, // ! testing messed up the type, weird
			collectionPath
		) as CollectionReference<T>
	}
