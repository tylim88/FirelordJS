import {
	limit as limit_,
	limitToLast as limitToLast_,
} from 'firebase/firestore'
import { LimitCreator } from '../types'

export const limitCreator: LimitCreator = (type, clause) => limit => {
	return { type, ref: clause(limit) }
}

/**
 * Creates a {@link QueryConstraint} that only returns the first matching documents.
 *
 * @param limit - The maximum number of items to return.
 * @returns The created {@link Query}.
 */
export const limit = limitCreator('limit', limit_)

/**
 * Creates a {@link QueryConstraint} that only returns the last matching documents.
 *
 * You must specify at least one `orderBy` clause for `limitToLast` queries,
 * otherwise an exception will be thrown during execution.(Prevented on type level)
 *
 * @param limit - The maximum number of items to return.
 * @returns The created {@link Query}.
 */
export const limitToLast = limitCreator('limitToLast', limitToLast_)
