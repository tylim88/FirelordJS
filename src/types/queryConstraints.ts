import { MetaType } from './metaTypeCreator'
import { FirelordFirestore } from './ori'
import { CursorType } from './cursor'

export type WhereConstraint<
	T extends MetaType,
	FieldPath extends keyof T['compare'] & string,
	OpStr extends FirelordFirestore.OriWhereFilterOp,
	Value
> = {
	type: 'where'
	fieldPath: FieldPath
	opStr: OpStr
	value: Value
	ref: FirelordFirestore.OriQueryConstraint
}

export type OrderByConstraint<
	FieldPath extends string,
	DirectionStr extends
		| FirelordFirestore.OriOrderByDirection
		| undefined = undefined
> = {
	type: 'orderBy'
	fieldPath: FieldPath
	directionStr: DirectionStr
	ref: FirelordFirestore.OriQueryConstraint
}

export type LimitConstraint<
	Type extends 'limit' | 'limitToLast',
	Value extends number
> = {
	type: Type
	value: Value
	ref: FirelordFirestore.OriQueryConstraint
}

export type CursorConstraint<
	Type extends CursorType,
	Values extends unknown[]
> = {
	type: Type
	values: Values
	ref: FirelordFirestore.OriQueryConstraint
}

export type QueryConstraints<T extends MetaType> =
	| WhereConstraint<
			T,
			keyof T['compare'] & string,
			FirelordFirestore.OriWhereFilterOp,
			unknown
	  >
	| LimitConstraint<'limit' | 'limitToLast', number>
	| CursorConstraint<CursorType, unknown[]>
	| OrderByConstraint<
			keyof T['compare'] & string,
			FirelordFirestore.OriOrderByDirection | undefined
	  >
