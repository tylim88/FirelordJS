import { MetaType } from '../metaTypeCreator'
import {
	QueryCompositeFilterConstraint,
	QueryFilterConstraints,
} from '../constraints'
import {
	AddSentinelFieldPathToCompare,
	AddSentinelFieldPathToCompareHighLevel,
} from '../fieldPath'
import { QueryFilterConstraintLimitation } from '../constraintLimitations'
import { Query, CollectionReference } from '../refs'
import { ErrorEmptyCompositeFilter } from '../error'

export type QueryCompositeFilter<
	T extends MetaType,
	Type extends 'and' | 'or'
> = <
	Q extends Query<T> | CollectionReference<T>,
	QFC extends QueryFilterConstraints<AddSentinelFieldPathToCompare<T>>[]
>(
	...queryFilterConstraints: QFC extends never
		? QFC
		: QFC extends never[]
		? ErrorEmptyCompositeFilter
		: QueryFilterConstraintLimitation<
				AddSentinelFieldPathToCompare<T>,
				AddSentinelFieldPathToCompareHighLevel<T, Q>,
				QFC,
				[],
				QueryCompositeFilterConstraint<T, Type, QFC>
		  >
) => QueryCompositeFilterConstraint<T, Type, QFC>
