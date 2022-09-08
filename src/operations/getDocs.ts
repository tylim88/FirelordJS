import {
	getDocs as getDocs_,
	getDocsFromCache as getDocsFromCache_,
	getDocsFromServer as getDocsFromServer_,
} from 'firebase/firestore'
import { GetDocs } from '../types'

/**
 * Executes the query and returns the results as a `QuerySnapshot`.
 *
 * Note: `getDocs()` attempts to provide up-to-date data when possible by
 * waiting for data from the server, but it may return cached data or fail if
 * you are offline and the server cannot be reached. To specify this behavior,
 * invoke {@link getDocsFromCache} or {@link getDocsFromServer}.
 *
 * @returns A `Promise` that will be resolved with the results of the query.
 */
// @ts-expect-error
export const getDocs: GetDocs = getDocs_

/**
 * Executes the query and returns the results as a `QuerySnapshot` from cache.
 * Returns an error if the document is not currently cached.
 *
 * @returns A `Promise` that will be resolved with the results of the query.
 */
// @ts-expect-error
export const getDocsFromCache: GetDocs = getDocsFromCache_

/**
 * Executes the query and returns the results as a `QuerySnapshot` from the
 * server. Returns an error if the network is not available.
 *
 * @returns A `Promise` that will be resolved with the results of the query.
 */
// @ts-expect-error
export const getDocsFromServer: GetDocs = getDocsFromServer_
