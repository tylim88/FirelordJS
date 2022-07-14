import { MetaType } from './metaTypeCreator'
import {
	OriWhereFilterOp,
	OriQueryConstraint,
	OriOrderByDirection,
} from './ori'
import { CursorType } from './cursor'

export type WhereConstraint<
	T extends MetaType,
	FieldPath extends keyof T['compare'] & string,
	OpStr extends OriWhereFilterOp,
	Value
> = {
	type: 'where'
	fieldPath: FieldPath
	opStr: OpStr
	value: Value
	ref: OriQueryConstraint
}

export type OrderByConstraint<
	FieldPath extends string,
	DirectionStr extends OriOrderByDirection | undefined = undefined
> = {
	type: 'orderBy'
	fieldPath: FieldPath
	directionStr: DirectionStr
	ref: OriQueryConstraint
}

export type LimitConstraint<
	Type extends 'limit' | 'limitToLast',
	Value extends number
> = {
	type: Type
	value: Value
	ref: OriQueryConstraint
}

export type CursorConstraint<
	Type extends CursorType,
	Values extends unknown[]
> = {
	type: Type
	values: Values
	ref: OriQueryConstraint
}

export type QueryConstraints<T extends MetaType> =
	| WhereConstraint<T, keyof T['compare'] & string, OriWhereFilterOp, unknown>
	| LimitConstraint<'limit' | 'limitToLast', number>
	| CursorConstraint<CursorType, unknown[]>
	| OrderByConstraint<
			keyof T['compare'] & string,
			OriOrderByDirection | undefined
	  >
