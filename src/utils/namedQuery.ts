import { namedQuery as namedQuery_, getFirestore } from 'firebase/firestore'
import { MetaTypes, Query, FirelordFirestore } from '../types'

/**
 * Reads a Firestore {@link Query} from local cache, identified by the given
 * name.
 *
 * The named queries are packaged  into bundles on the server side (along
 * with resulting documents), and loaded to local cache using `loadBundle`. Once
 * in local cache, use this method to extract a {@link Query} by name.
 *
 * @param firestore - Optional. The {@link Firestore} instance to read the query from. If no value is provided, default Firestore instance is used.
 * @param name - The name of the query.
 * @returns A `Promise` that is resolved with the Query or `null`.
 */
export const namedQuery = (
	name: string,
	firestore?: FirelordFirestore.Firestore
) => {
	return namedQuery_(
		firestore || getFirestore(),
		name
	) as Promise<Query<MetaTypes> | null>
}
