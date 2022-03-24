import {
	MetaType,
	CollectionReference,
	FirelordFirestore,
	IsValidID,
} from '../types'
import { collection as collection_, getFirestore } from 'firebase/firestore'

/**
 * Gets a `CollectionReference` instance that refers to the collection at
 * the specified absolute path.
 *
 * @param path - A slash-separated path to a collection.
 * argument.
 * @param firestore - Optional. A reference to the root `Firestore` instance. If no value is provided, default Firestore instance is used.
 * @throws If the final path has an even number of segments and does not point
 * to a collection.
 * @returns The `CollectionReference` instance.
 */
export const collection = <
	T extends MetaType,
	Path extends T['collectionPath'] = T['collectionPath']
>(
	path: Path extends never
		? Path
		: Path extends IsValidID<Path, 'Collection', '/'>
		? T['collectionPath']
		: IsValidID<Path, 'Collection', '/'>,
	firestore?: FirelordFirestore.Firestore
) => {
	return collection_(
		firestore || getFirestore(),
		path
	) as CollectionReference<T>
}

export const collectionCreator =
	<T extends MetaType>(
		firestore: FirelordFirestore.Firestore,
		collectionPath: T['collectionPath']
	) =>
	() => {
		return collection(
			collectionPath as string,
			firestore
		) as CollectionReference<T>
	}
