import { FirelordFirestore, Set } from '../types'
import { setDoc as setDoc_ } from 'firebase/firestore'

/**
Writes to the document referred to by this DocumentReference. If the document does not yet exist, it will be created.

@param reference — A reference to the document to write.

@param data — A map of the fields and values for the document.

@param options - An object to configure the set behavior.

@returns
A Promise resolved once the data has been successfully written to the backend (note that it won't resolve while you're offline).
*/
export const setDoc = ((
	reference: FirelordFirestore.DocumentReference,
	data: FirelordFirestore.DocumentData,
	options?: FirelordFirestore.SetOptions
) => {
	const ref = options
		? setDoc_(reference, data, options)
		: setDoc_(reference, data)
	return ref
}) as unknown as Set // const setDoc:Set = .... type mismatched though
