import { or as or_ } from 'firebase/firestore'
import { MetaType, Or } from '../types'
import { queryBuilder } from './utils'
/**
 * Creates a new {@link QueryCompositeFilterConstraint} that is a disjunction of
 * the given filter constraints. A disjunction filter includes a document if it
 * satisfies any of the given filters.
 *
 * @param queryConstraints - Optional. The list of
 * {@link QueryFilterConstraint}s to perform a disjunction for. These must be
 * created with calls to {@link where}, {@link or}, or {@link and}.
 * @returns The newly created {@link QueryCompositeFilterConstraint}.
 */
export const orCreator =
	<T extends MetaType>(): Or<T> =>
	// @ts-expect-error
	(...queryConstraints) => {
		return or_(...queryBuilder(queryConstraints))
	}
