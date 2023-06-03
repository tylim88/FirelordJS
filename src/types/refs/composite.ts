import { MetaType } from '../metaTypeCreator'
import { QueryFilterConstraints } from '../queryConstraints'
import { QueryFilterConstraintLimitation } from '../queryConstraintsLimitations'
import { CollectionReference } from './collection'
import { Query } from './query'
import { ErrorEmptyCompositeFilter } from '../error'
import { OriQueryCompositeFilterConstraint } from '../alias'

export type QueryCompositeFilterConstraint<
	T extends MetaType,
	Y extends 'and' | 'or',
	X extends QueryFilterConstraints<T>[]
> = {
	type: Y
	constraints: X
	ref: OriQueryCompositeFilterConstraint
}

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
