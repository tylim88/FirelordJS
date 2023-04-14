import { MetaType } from '../metaTypeCreator'
import { WhereFilterOp, OrderByDirection } from '../alias'
import { CursorType } from '../cursor'

export type WhereConstraint<
	T extends MetaType,
	FieldPath extends keyof T['compare'] & string,
	OpStr extends WhereFilterOp,
	Value
> = {
	type: 'where'
	_field: FieldPath
	_op: OpStr
	_value: Value
}

export type OrderByConstraint<
	FieldPath extends string,
	DirectionStr extends OrderByDirection | undefined = undefined
> = {
	type: 'orderBy'
	_field: FieldPath
	_direction: DirectionStr
}

type LimitType = {
	limit: 'F'
	limitToLast: 'L'
}

export type LimitConstraint<
	Type extends 'limit' | 'limitToLast',
	Value extends number
> = {
	type: Type
	_limit: Value
	_limitType: LimitType[Type]
}

export type CursorConstraint<
	Type extends CursorType,
	Values extends unknown[]
> = {
	type: Type
	_docOrFields: Values
	_inclusive: boolean
}
