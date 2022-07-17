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
			firestore || fStore, // ! type messed up, after adding firestore of testing type, weird
			collectionPath
		) as CollectionReference<T>
	}
