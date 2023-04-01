import { WhereConstraint, QueryConstraints } from './query'
import { MetaType } from '../metaTypeCreator'
import { WhereFilterOp } from '../alias'

export type QueryCompositeFilterConstraint<
	T extends MetaType,
	Y extends 'and' | 'or',
	X extends QueryFilterConstraints<T>[]
> = {
	type: Y
	'do_not_access.query_filter_constraint'?: X
}

export type QueryFilterConstraints<T extends MetaType> =
	| WhereConstraint<T, keyof T['compare'] & string, WhereFilterOp, unknown>
	| QueryCompositeFilterConstraint<T, 'and' | 'or', QueryFilterConstraints<T>[]>

export type QQC<T extends MetaType> =
	| QueryConstraints<T>
	| QueryCompositeFilterConstraint<T, 'and' | 'or', QueryFilterConstraints<T>[]>
