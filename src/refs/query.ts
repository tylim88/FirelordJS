import { query as query_ } from 'firebase/firestore'
import {
	MetaTypes,
	Query,
	CollectionReference,
	QueryConstraints,
	QueryConstraintLimitation,
} from '../types'

/**
 * Creates a new immutable instance of {@link Query} that is extended to also include
 * additional query constraints.
 *
 * @param query - The {@link Query} instance to use as a base for the new constraints.
 * @param queryConstraints - The list of {@link QueryConstraint}s to apply.
 * @throws if any of the provided query constraints cannot be combined with the
 * existing or new constraints.
 */
export const query = <T extends MetaTypes, QC extends QueryConstraints<T>[]>(
	query: Query<T> | CollectionReference<T>,
	...queryConstraints: QC extends never
		? QC
		: QueryConstraintLimitation<T, QC, [], QC>
) => {
	return query_(
		// @ts-expect-error
		query,
		...queryConstraints
	) as Query<T>
}
