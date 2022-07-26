import { query as query_ } from 'firebase/firestore'
import {
	MetaType,
	Query,
	CollectionReference,
	QueryConstraints,
	QueryConstraintLimitation,
	AddSentinelFieldPathToCompare,
	IsEqual,
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
	Q extends Query<T>,
	QC extends QueryConstraints<AddSentinelFieldPathToCompare<T>>[]
>(
	query: Q extends never
		? Q
		: IsEqual<Q, Query<T>> extends true
		? Query<T>
		: IsEqual<Q, CollectionReference<T>> extends true
		? CollectionReference<T>
		: never, // has to code this way to infer T perfectly
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
		...queryConstraints.reduce((acc, qc) => {
			const type = qc.type
			if (
				type === 'startAt' ||
				type === 'startAfter' ||
				type === 'endAt' ||
				type === 'endBefore'
			) {
				qc.values.length !== 0 &&
					acc.push(
						// @ts-expect-error
						qc.ref
					)
			} else {
				acc.push(
					// @ts-expect-error
					qc.ref
				)
			}
			return acc
		}, [] as QueryConstraints<AddSentinelFieldPathToCompare<T>>[])
	) as Query<T>
}
