import { endAt as endAt_ } from 'firebase/firestore'
import { Cursor } from '../types'
/**
 * Creates a {@link QueryConstraint} that modifies the result set to end at the
 * provided document (exclusive). The ending position is relative to the order
 * of the query. The document must contain all of the fields provided in the
 * orderBy of the query.
 *
 * @param snapshotOrFieldValues - The snapshot of the document to end at OR the field values to end this query at, in order
 * of the query's order by.
 * @returns A {@link QueryConstraint} to pass to `query()`
 */
// @ts-expect-error
export const endAt: Cursor<'endAt'> = (...snapshotOrFieldValues) => {
	return {
		type: 'endAt',
		values: snapshotOrFieldValues,
		ref: endAt_(snapshotOrFieldValues),
	}
}
