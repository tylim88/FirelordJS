import {
	MetaTypes,
	DocumentReference,
	FirelordFirestore,
	IsValidID,
} from '../types'

export const docCreator =
	<T extends MetaTypes>(
		doc: FirelordFirestore.Doc,
		firestore: FirelordFirestore.Firestore,
		collectionPath: T['collectionPath']
	) =>
	<DocumentId extends string>(
		documentID: DocumentId extends never
			? DocumentId
			: DocumentId extends IsValidID<DocumentId, 'Document'>
			? T['docID']
			: IsValidID<DocumentId, 'Document'>
	) => {
		const ref = doc(firestore, collectionPath, documentID)
		// do not change ref runtime value, because document ref is firestore data type
		return ref as DocumentReference<T>
	}
