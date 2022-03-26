import { MetaType } from './metaTypeCreator'
import { FirelordFirestore } from './firelordFirestore'
import { CursorType } from './cursor'

export type WhereConstraint<
	T extends MetaType,
	FieldPath extends keyof T['compare'] & string,
	OpStr extends FirelordFirestore.WhereFilterOp,
	Value
> = {
	type: 'where'
	fieldPath: FieldPath
	opStr: OpStr
	value: Value
	ref: FirelordFirestore.QueryConstraint
}

export type OrderByConstraint<
	T extends MetaType,
	FieldPath extends string,
	DirectionStr extends
		| FirelordFirestore.OrderByDirection
		| undefined = undefined
> = {
	type: 'orderBy'
	fieldPath: FieldPath
	directionStr: DirectionStr
	ref: FirelordFirestore.QueryConstraint
}

export type LimitConstraint<
	Type extends 'limit' | 'limitToLast',
	Value extends number
> = {
	type: Type
	value: Value
	ref: FirelordFirestore.QueryConstraint
}

export type CursorConstraint<
	Type extends CursorType,
	Values extends unknown[]
> = {
	type: Type
	values: Values
	ref: FirelordFirestore.QueryConstraint
}

export type QueryConstraints<T extends MetaType> =
	| WhereConstraint<
			T,
			keyof T['compare'] & string,
			FirelordFirestore.WhereFilterOp,
			unknown
	  >
	| LimitConstraint<'limit' | 'limitToLast', number>
	| CursorConstraint<CursorType, unknown[]>
	| OrderByConstraint<
			T,
			keyof T['compare'] & string,
			FirelordFirestore.OrderByDirection | undefined
	  >
