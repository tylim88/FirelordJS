import { MetaType } from '../metaTypeCreator'
import { Firestore_ } from '../alias'

/**
 * A `Query` refers to a query which you can read or listen to. You can also
 * construct refined `Query` objects by adding filters and ordering.
 */
// Query<T> is needed in order to infer the type correctly
// eslint-disable-next-line unused-imports/no-unused-vars
export interface Query<T extends MetaType> {
	/** The type of this Firestore reference. */
	readonly type: 'query' | 'collection'
	/**
	 * The `Firestore` instance for the Firestore database (useful for performing
	 * transactions, etc.).
	 */
	readonly firestore: Firestore_
}

import { QueryAllConstraints, QueryConstraints } from '../queryConstraints'
import {
	QueryConstraintLimitation,
	FlattenQueryCompositeFilterConstraint,
	ValidateTopLevelQueryCompositeFilterPartOne,
	ValidateTopLevelQueryCompositeFilterPartTwo,
	ValidateOrderByAndInequalityWhere,
} from '../queryConstraintsLimitations'
import { CollectionReference } from './collection'

export type QueryRef = <
	Z extends MetaType,
	Q extends Query<Z> | CollectionReference<Z>,
	const QQCs extends readonly QueryAllConstraints<Z>[]
>(
	query: Q extends never ? Q : Query<Z> | CollectionReference<Z>,
	...queryConstraints: QQCs extends never
		? QQCs
		: Z extends infer T extends MetaType
		? ValidateTopLevelQueryCompositeFilterPartOne<
				T,
				QQCs
		  > extends infer B extends string
			? B
			: ValidateTopLevelQueryCompositeFilterPartTwo<
					T,
					QQCs
			  > extends infer C extends string
			? C
			: FlattenQueryCompositeFilterConstraint<
					T,
					QQCs
			  > extends infer AllFlattenQCs extends QueryConstraints<Z>[]
			? ValidateOrderByAndInequalityWhere<
					T,
					AllFlattenQCs
			  > extends infer K extends string
				? K
				: QueryConstraintLimitation<T, Q, QQCs, [], AllFlattenQCs>
			: never
		: never
) => Query<Z>
