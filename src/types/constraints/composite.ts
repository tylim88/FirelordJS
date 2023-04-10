import { MetaType } from '../metaTypeCreator'
import { QueryFilterConstraints } from './query'

export type QueryCompositeFilterConstraint<
	T extends MetaType,
	Y extends 'and' | 'or',
	X extends QueryFilterConstraints<T>[]
> = {
	type: Y
	'do_not_access.query_filter_constraint'?: X
}
