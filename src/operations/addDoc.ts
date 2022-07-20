import { addDoc as addDoc_ } from 'firebase/firestore'
import { MetaType, CollectionReference, DocumentReference } from '../types'
import { removeFieldValueInhomogeneousProps } from '../fieldValue'
/** 
	Add a new document to specified CollectionReference with the given data, assigning it a document ID automatically.

	@param reference — A reference to the collection to add this document to.
	
	@param data — An Object containing the data for the new document.
	
	@returns
	A Promise resolved with a DocumentReference pointing to the newly created document after it has been written to the backend (Note that it won't resolve while you're offline).
*/
export const addDoc = <T extends MetaType>(
	reference: CollectionReference<T>,
	data: T['write']
) => {
	return addDoc_(
		// @ts-expect-error
		reference,
		removeFieldValueInhomogeneousProps(data)
	) as Promise<DocumentReference<T>>
}
