import {
	MetaTypes,
	DocumentReference,
	FirelordFirestore,
	IsValidID,
} from '../types'
import { doc as doc_, getFirestore } from 'firebase/firestore'

/**
 * Gets a `DocumentReference` instance that refers to the document at the
 * specified absolute path.
 *
 * @param path - A slash-separated path to a document.
 * @throws If the final path has an odd number of segments and does not point to
 * a document.
 * @param firestore - Optional. A reference to the root `Firestore` instance. If no value is provided, default Firestore instance is used.
 * @returns The `DocumentReference` instance.
 */
export const doc = <
	T extends MetaTypes,
	Path extends T['docPath'] = T['docPath']
>(
	path: Path extends never
		? Path
		: Path extends IsValidID<Path, 'Document'>
		? T['docPath']
		: IsValidID<Path, 'Document'>,
	firestore?: FirelordFirestore.Firestore
) => {
	return doc_(firestore || getFirestore(), path) as DocumentReference<T>
}

export const docCreator =
	<T extends MetaTypes>(
		firestore: FirelordFirestore.Firestore,
		collectionPath: T['collectionPath']
	) =>
	<DocumentId extends T['docID']>(
		documentID: DocumentId extends never
			? DocumentId
			: DocumentId extends IsValidID<DocumentId, 'Document'>
			? T['docID']
			: IsValidID<DocumentId, 'Document'>
	) => {
		return doc(
			collectionPath + '/' + documentID,
			firestore
		) as DocumentReference<T>
	}
