import { getDoc as getDoc_ } from 'firebase/firestore'
import { Get } from '../types'
/**
Reads the document referred to by this DocumentReference.

Note: getDoc() attempts to provide up-to-date data when possible by waiting for data from the server, but it may return cached data or fail if you are offline and the server cannot be reached. To specify this behavior, invoke getDocFromCache or getDocFromServer.

@param reference — The reference of the document to fetch.

@returns
A Promise resolved with a DocumentSnapshot containing the current document contents.
*/

// @ts-expect-error
export const getDoc: Get = async reference => {
	const ref = await getDoc_(
		// @ts-expect-error
		reference
	)
	return ref
}
