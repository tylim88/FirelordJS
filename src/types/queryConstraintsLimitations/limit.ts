import { MetaType } from '../metaTypeCreator'
import { ErrorLimitToLastOrderBy } from '../error'
import { QueryConstraints, LimitConstraint } from '../queryConstraints'

export type LimitToLastConstraintLimitation<
	T extends MetaType,
	U extends LimitConstraint<'limitToLast'>,
	AllQCs extends readonly QueryConstraints[]
> = AllQCs extends (infer A)[]
	? A extends QueryConstraints
		? A['type'] extends 'orderBy'
			? U
			: ErrorLimitToLastOrderBy
		: never // impossible route
	: never // impossible route
