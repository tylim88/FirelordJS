import { getDocs as getDocs_ } from 'firebase/firestore'
import { MetaTypes, Query, QuerySnapshot } from '../types'

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
export const getDocs = <T extends MetaTypes>(query: Query<T>) => {
	return getDocs_(
		// @ts-expect-error
		query
	) as Promise<QuerySnapshot<T>>
}
