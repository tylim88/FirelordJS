import { DocumentReference } from './refs'
import { MetaType } from './metaTypeCreator'
import { Firestore } from './alias'
import { IsValidID } from './validID'

export type DocCreator = <T extends MetaType>(
	fStore: Firestore,
	collectionPath: T['collectionPath']
) => Doc<T>

/**
 * A `DocumentReference` refers to a document location in a Firestore database
 * and can be used to write, read, or listen to the location. The document at
 * the referenced location may or may not exist.
 */
export type Doc<T extends MetaType> = {
	/**
	 * Gets a `DocumentReference` instance that refers to the document at the
	 * specified absolute path.
	 *
	 * @param documentId - A document ID. ID is not path, ID is the last segment of the path.
	 * @returns The `DocumentReference` instance.
	 */
	<DocumentId extends T['docID']>(
		documentID: DocumentId extends never
			? DocumentId
			: DocumentId extends IsValidID<DocumentId, 'Document', 'ID'>
			? T['docID']
			: IsValidID<DocumentId, 'Document', 'ID'>
	): DocumentReference<T>
	/**
	 * Gets a `DocumentReference` instance that refers to the document at the
	 * specified absolute path.
	 *
	 * @param firestore - A reference to the root `Firestore` instance.
	 * @param documentId - A document ID. ID is not path, ID is the last segment of the path.
	 * @returns The `DocumentReference` instance.
	 */
	<DocumentId extends T['docID']>(
		firestore: Firestore,
		documentID: DocumentId extends never
			? DocumentId
			: DocumentId extends IsValidID<DocumentId, 'Document', 'ID'>
			? T['docID']
			: IsValidID<DocumentId, 'Document', 'ID'>
	): DocumentReference<T>
}
