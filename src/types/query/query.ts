import { MetaType } from '../metaTypeCreator'
import { QueryAllConstraints, QueryConstraints } from '../constraints'
import {
	AddSentinelFieldPathToCompare,
	AddSentinelFieldPathToCompareHighLevel,
} from '../fieldPath'
import {
	QueryConstraintLimitation,
	FlattenQueryCompositeFilterConstraint,
	ValidateTopLevelQueryCompositeFilterPartOne,
	ValidateTopLevelQueryCompositeFilterPartTwo,
	ValidateOrderByAndInequalityWhere,
} from '../constraintLimitations'
import { Query, CollectionReference } from '../refs'
import { IsSame } from '../utils'

export type QueryRef = <
	Z extends MetaType,
	Q extends Query<Z> | CollectionReference<Z>,
	const QQCs extends readonly QueryAllConstraints<
		AddSentinelFieldPathToCompare<Z>
	>[]
>(
	query: Q extends never ? Q : Query<Z> | CollectionReference<Z>,
	...queryConstraints: QQCs extends never
		? QQCs
		: AddSentinelFieldPathToCompare<Z> extends infer T extends MetaType
		? ValidateTopLevelQueryCompositeFilterPartOne<T, QQCs> extends infer B
			? IsSame<B, string> extends true
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
					: QueryConstraintLimitation<
							T,
							AddSentinelFieldPathToCompareHighLevel<Z, Q>,
							QQCs,
							[],
							AllFlattenQCs
					  >
				: never
			: never
		: never
) => Query<Z>
