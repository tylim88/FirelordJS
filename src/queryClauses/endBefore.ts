import { endBefore as endBefore_ } from 'firebase/firestore'
import { Cursor } from '../types'
/**
 * Creates a {@link QueryConstraint} that modifies the result set to end before the
 * provided document (exclusive). The starting position is relative to the order
 * of the query. The document must contain all of the fields provided in the
 * orderBy of the query.
 *
 * @param snapshotOrFieldValues - The snapshot of the document to end before OR the field values to end this query before, in order
 * of the query's order by.
 * @returns A {@link QueryConstraint} to pass to `query()`
 */
// @ts-expect-error
export const endBefore: Cursor<'endBefore'> = (...snapshotOrFieldValues) => {
	return {
		type: 'endBefore',
		values: snapshotOrFieldValues,
		ref: endBefore_(snapshotOrFieldValues),
	}
}
