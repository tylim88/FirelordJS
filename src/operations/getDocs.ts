import {
	getDocs as getDocs_,
	getDocsFromCache as getDocsFromCache_,
	getDocsFromServer as getDocsFromServer_,
} from 'firebase/firestore'
import { MetaType, Query, QuerySnapshot } from '../types'

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
export const getDocs = <T extends MetaType>(query: Query<T>) => {
	return getDocs_(
		// @ts-expect-error
		query
	) as unknown as Promise<QuerySnapshot<T>>
}

/**
 * Executes the query and returns the results as a `QuerySnapshot` from cache.
 * Returns an error if the document is not currently cached.
 *
 * @returns A `Promise` that will be resolved with the results of the query.
 */
export const getDocsFromCache = <T extends MetaType>(query: Query<T>) => {
	return getDocsFromCache_(
		// @ts-expect-error
		query
	) as unknown as Promise<QuerySnapshot<T>>
}

/**
 * Executes the query and returns the results as a `QuerySnapshot` from the
 * server. Returns an error if the network is not available.
 *
 * @returns A `Promise` that will be resolved with the results of the query.
 */
export const getDocsFromServer = <T extends MetaType>(query: Query<T>) => {
	return getDocsFromServer_(
		// @ts-expect-error
		query
	) as unknown as Promise<QuerySnapshot<T>>
}
