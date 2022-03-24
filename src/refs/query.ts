import { query as query_ } from 'firebase/firestore'
import {
	MetaType,
	Query,
	CollectionReference,
	QueryConstraints,
	QueryConstraintLimitation,
	AddSentinelFieldPathToCompare,
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
export const query = <
	T extends MetaType,
	QC extends QueryConstraints<AddSentinelFieldPathToCompare<T>>[],
	Q extends Query<T> | CollectionReference<T>
>(
	query: Q extends never ? Q : Query<T> | CollectionReference<T>,
	...queryConstraints: QC extends never
		? QC
		: QueryConstraintLimitation<AddSentinelFieldPathToCompare<T>, QC, [], QC, Q>
) => {
	return query_(
		// @ts-expect-error
		query,
		...queryConstraints.map(qc => qc.ref)
	) as Query<T>
}
