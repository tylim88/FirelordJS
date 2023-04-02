import { MetaType } from '../metaTypeCreator'
import { QQC, QueryConstraints } from '../constraints'
import {
	AddSentinelFieldPathToCompare,
	AddSentinelFieldPathToCompareHighLevel,
} from '../fieldPath'
import {
	QueryConstraintLimitation,
	FlattenQueryCompositeFilterConstraint,
	ValidateTopLevelQueryCompositeFilter,
	ValidateOrderByAndInequalityWhere,
} from '../constraintLimitations'
import { Query, CollectionReference } from '../refs'

export type QueryRef = <
	T extends MetaType,
	Q extends Query<T> | CollectionReference<T>,
	const QQCs extends readonly QQC<AddSentinelFieldPathToCompare<T>>[]
>(
	query: Q extends never ? Q : Query<T> | CollectionReference<T>,
	...queryConstraints: QQCs extends never
		? QQCs
		: AddSentinelFieldPathToCompare<T> extends infer AT extends MetaType
		? FlattenQueryCompositeFilterConstraint<
				AT,
				QQCs
		  > extends infer AllQCs extends QueryConstraints<T>[]
			? ValidateTopLevelQueryCompositeFilter<
					AT,
					QQCs
			  > extends infer B extends string
				? B[]
				: ValidateOrderByAndInequalityWhere<
						AT,
						AllQCs
				  > extends infer K extends string
				? K[]
				: QueryConstraintLimitation<
						AT,
						AddSentinelFieldPathToCompareHighLevel<T, Q>,
						QQCs,
						[],
						AllQCs
				  >
			: never
		: never
) => Query<T>
