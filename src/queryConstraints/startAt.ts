import { startAt as startAt_ } from 'firebase/firestore'
import { Cursor } from '../types'

/**
 * Creates a {@link QueryConstraint} that modifies the result set to start at the
 * provided document (exclusive). The starting position is relative to the order
 * of the query. The document must contain all of the fields provided in the
 * orderBy of the query.
 *
 * @param snapshotOrFieldValues - The snapshot of the document to start at OR the field values to start this query at, in order
 * of the query's order by.
 * @returns A {@link QueryConstraint} to pass to `query()`
 */
// @ts-expect-error
export const startAt: Cursor<'startAt'> = startAt_
