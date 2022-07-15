import { orderBy as orderBy_ } from 'firebase/firestore'
import { OrderByConstraint, OriOrderByDirection, MetaType } from '../types'

/**
 * Creates a {@link QueryConstraint} that sorts the query result by the
 * specified field, optionally in descending order instead of ascending.
 *
 * @param fieldPath - The field to sort by.
 * @param directionStr - Optional direction to sort by ('asc' or 'desc'). If
 * not specified, order will be ascending.
 * @returns The created {@link Query}.
 */
export const orderBy = <
	T extends MetaType,
	FieldPath extends keyof T['compare'] & string,
	DirectionStr extends OriOrderByDirection | undefined = undefined
>(
	fieldPath: FieldPath extends never ? FieldPath : FieldPath,
	directionStr?: DirectionStr extends never ? DirectionStr : DirectionStr
): OrderByConstraint<FieldPath, DirectionStr> => {
	return {
		type: 'orderBy',
		fieldPath,
		directionStr: directionStr as DirectionStr,
		ref: orderBy_(fieldPath, directionStr),
	}
}
