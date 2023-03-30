import { and as and_ } from 'firebase/firestore'
import { And, MetaType } from '../types'
import { queryBuilder } from './utils'

/**
 * Creates a new {@link QueryCompositeFilterConstraint} that is a conjunction of
 * the given filter constraints. A conjunction filter includes a document if it
 * satisfies all of the given filters.
 *
 * @param queryConstraints - Optional. The list of
 * {@link QueryFilterConstraint}s to perform a conjunction for. These must be
 * created with calls to {@link where}, {@link or}, or {@link and}.
 * @returns The newly created {@link QueryCompositeFilterConstraint}.
 */
export const andCreator =
	<T extends MetaType>(): And<T> =>
	// @ts-expect-error
	(...queryConstraints) => {
		return and_(...queryBuilder(queryConstraints))
	}
