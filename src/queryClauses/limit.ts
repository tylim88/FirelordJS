import {
	limit as limit_,
	limitToLast as limitToLast_,
} from 'firebase/firestore'
import {
	LimitConstraint,
	OriQueryConstraint,
	ErrorLimitInvalidNumber,
} from '../types'

export const limitCreator =
	<Type extends 'limit' | 'limitToLast'>(
		type: Type,
		clause: (limit: number) => OriQueryConstraint
	) =>
	<Value extends number>(
		limit: Value extends 0
			? ErrorLimitInvalidNumber
			: number extends Value
			? Value
			: Value extends infer R
			? `${R & number}` extends `-${number}` | `${number}.${number}`
				? ErrorLimitInvalidNumber
				: Value
			: never // impossible route
	): LimitConstraint<Type, Value> => {
		return {
			type,
			value: limit as Value,
			ref: clause(limit),
		}
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
