import { startAfter as startAfter_ } from 'firebase/firestore'
import { Cursor } from '../types'
/**
 * Creates a {@link QueryConstraint} that modifies the result set to start after the
 * provided document (exclusive). The starting position is relative to the order
 * of the query. The document must contain all of the fields provided in the
 * orderBy of the query.
 *
 * @param snapshotOrFieldValues - The snapshot of the document to start after OR the field values to start this query after, in order
 * of the query's order by.
 * @returns A {@link QueryConstraint} to pass to `query()`
 */
// @ts-expect-error
export const startAfter: Cursor<'startAfter'> = (...snapshotOrFieldValues) => {
	return {
		type: 'startAfter',
		values: snapshotOrFieldValues,
		ref: startAfter_(snapshotOrFieldValues),
	}
}
