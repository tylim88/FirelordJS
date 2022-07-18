import {
	getDoc as getDoc_,
	getDocFromCache as getDocFromCache_,
	getDocFromServer as getDocFromServer_,
} from 'firebase/firestore'
import { Get, OriDocumentReference, DocumentSnapshot, MetaType } from '../types'
/**
Reads the document referred to by this DocumentReference.

Note: getDoc() attempts to provide up-to-date data when possible by waiting for data from the server, but it may return cached data or fail if you are offline and the server cannot be reached. To specify this behavior, invoke getDocFromCache or getDocFromServer.

@param reference — The reference of the document to fetch.

@returns
A Promise resolved with a DocumentSnapshot containing the current document contents.
*/
export const getDoc: Get = ((reference: OriDocumentReference) => {
	return getDoc_(reference) as Promise<DocumentSnapshot<MetaType>>
}) as Get

/**
 * Reads the document referred to by this `DocumentReference` from cache.
 * Returns an error if the document is not currently cached.
 *
 * @returns A `Promise` resolved with a `DocumentSnapshot` containing the
 * current document contents.
 */
export const getDocFromCache = ((reference: OriDocumentReference) => {
	return getDocFromCache_(reference) as Promise<DocumentSnapshot<MetaType>>
}) as Get
/**
 * Reads the document referred to by this `DocumentReference` from the server.
 * Returns an error if the network is not available.
 *
 * @returns A `Promise` resolved with a `DocumentSnapshot` containing the
 * current document contents.
 */
export const getDocFromServer = ((reference: OriDocumentReference) => {
	return getDocFromServer_(reference) as Promise<DocumentSnapshot<MetaType>>
}) as Get
