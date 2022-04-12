import { query as query_ } from 'firebase/firestore'
import {
	MetaType,
	Query,
	CollectionReference,
	QueryConstraints,
	QueryConstraintLimitation,
	AddSentinelFieldPathToCompare,
	AddSentinelFieldPathToCompareHighLevel,
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
	Q extends Query<T> | CollectionReference<T>,
	QC extends QueryConstraints<AddSentinelFieldPathToCompare<T>>[]
>(
	query: Q extends never
		? Q
		: Q extends Query<T>
		? Query<T>
		: Q extends CollectionReference<T>
		? CollectionReference<T>
		: never, // has to code this way to infer T perfectly without union Query<T> | CollectionReference<T>
	...queryConstraints: QC extends never
		? QC
		: QueryConstraintLimitation<
				AddSentinelFieldPathToCompare<T>,
				AddSentinelFieldPathToCompareHighLevel<T, Q>,
				QC,
				[],
				QC
		  >
) => {
	return query_(
		// @ts-expect-error
		query,
		...queryConstraints.map(qc => qc.ref)
	) as unknown as Query<T>
}
