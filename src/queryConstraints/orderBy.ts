import { orderBy as orderBy_ } from 'firebase/firestore'
import { OrderByConstraint, FirelordFirestore, MetaTypes } from '../types'

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
	T extends MetaTypes,
	FieldPath extends string,
	DirectionStr extends
		| FirelordFirestore.OrderByDirection
		| undefined = undefined
>(
	fieldPath: FieldPath extends never ? FieldPath : keyof T['compare'] & string,
	directionStr?: DirectionStr extends never ? DirectionStr : DirectionStr
) => {
	return orderBy_(fieldPath, directionStr) as OrderByConstraint<
		T,
		FieldPath,
		DirectionStr
	>
}
