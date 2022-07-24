import { MetaType } from './metaTypeCreator'
import { DocumentReference } from './refs'
import { DocumentSnapshot } from './snapshot'
/**
Reads the document referred to by this DocumentReference.

Note: getDoc() attempts to provide up-to-date data when possible by waiting for data from the server, but it may return cached data or fail if you are offline and the server cannot be reached. To specify this behavior, invoke getDocFromCache or getDocFromServer.

@param reference — The reference of the document to fetch.

@returns
A Promise resolved with a DocumentSnapshot containing the current document contents.
*/
export type Get = <T extends MetaType>(
	reference: DocumentReference<T>
) => Promise<DocumentSnapshot<T>>
