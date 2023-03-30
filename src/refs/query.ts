import { query as query_ } from 'firebase/firestore'
import { QueryRef } from '../types'
import { queryBuilder } from './utils'

/**
 * Creates a new immutable instance of {@link Query} that is extended to also include
 * additional query constraints.
 *
 * @param query - The {@link Query} instance to use as a base for the new constraints.
 * @param queryConstraints - The list of {@link QueryConstraint}s to apply.
 * @throws if any of the provided query constraints cannot be combined with the
 * existing or new constraints.
 */
// @ts-expect-error
export const query: QueryRef = (query, ...queryConstraints) => {
	return query_(query, ...queryBuilder(queryConstraints))
}
