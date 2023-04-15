import { MetaType } from '../metaTypeCreator'
import {
	QueryCompositeFilterConstraint,
	QueryFilterConstraints,
} from '../constraints'
import { QueryFilterConstraintLimitation } from '../constraintLimitations'
import { Query, CollectionReference } from '../refs'
import { ErrorEmptyCompositeFilter } from '../error'

export type QueryCompositeFilter<
	T extends MetaType,
	Type extends 'and' | 'or'
> = <
	Q extends Query<T> | CollectionReference<T>,
	QFCs extends QueryFilterConstraints<T>[]
>(
	...queryFilterConstraints: QFCs extends never
		? QFCs
		: QFCs extends never[]
		? ErrorEmptyCompositeFilter
		: QueryFilterConstraintLimitation<
				T,
				Q,
				QFCs,
				[],
				QueryCompositeFilterConstraint<T, Type, QFCs>
		  >
) => QueryCompositeFilterConstraint<T, Type, QFCs>
