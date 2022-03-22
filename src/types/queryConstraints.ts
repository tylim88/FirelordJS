import { MetaTypes } from './metaTypeCreator'
import { FirelordFirestore } from './firelordFirestore'

export type WhereConstraint<
	FieldPath extends string,
	OpStr extends FirelordFirestore.WhereFilterOp,
	Value
> = Readonly<{
	readonly type: 'where'
	readonly fieldPath: FieldPath
	readonly opStr: OpStr
	readonly value: Value
}>

const a = Object.freeze({ a: 1 })

export type OrderByConstraint<
	FieldPath extends string,
	DirectionStr extends
		| FirelordFirestore.OrderByDirection
		| undefined = undefined
> = {
	type: 'orderBy'
	fieldPath: FieldPath
	directionStr: DirectionStr
}

export type LimitConstraint<
	Clause extends 'limit' | 'limitToLast',
	Value extends number
> = {
	type: Clause
	value: Value
}

export type CursorConstraint<Values extends unknown[]> = {
	type: 'cursor'
	values: Values
}

export type QueryConstraints<T extends MetaTypes> =
	| WhereConstraint<
			keyof T['compare'] & string,
			FirelordFirestore.WhereFilterOp,
			unknown
	  >
	| LimitConstraint<'limit' | 'limitToLast', number>
	| CursorConstraint<unknown[]>
	| OrderByConstraint<
			keyof T['compare'] & string,
			FirelordFirestore.OrderByDirection | undefined
	  >
