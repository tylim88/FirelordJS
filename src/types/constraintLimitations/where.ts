import { MetaType } from '../metaTypeCreator'
import { WhereFilterOp } from '../alias'
import {
	ErrorWhereCompareValueMustBeArray,
	ErrorWhereNotIn,
	ErrorWhereArrayContainsArrayContainsAny,
	ErrorWhereInequalityOpStrSameField,
	ErrorWhereOnlyOneNotEqual,
	ErrorWhereNoNeverEmptyArray,
	ErrorWhereInOrNotInValueIsNotArray,
} from '../error'
import { QueryConstraints, WhereConstraint } from '../constraints'
import { Query } from '../refs'
import { GetCorrectDocumentIdBasedOnRef } from '../fieldPath'
import {
	In,
	NotIn,
	ArrayContainsAny,
	NotEqual,
	ArrayContains,
	InequalityOpStr,
	ValueOfOptStr,
	ArrayOfOptStr,
	ValueOfOnlyArrayOptStr,
	ElementOfOptStr,
	Or,
} from './utils'
import { DeepValue } from '../objectFlatten'

// You can't combine 'not-in' with 'or', 'in', 'array-contains-any', or '!=' in the same query.
type ValidateWhereNotIn<
	T extends MetaType,
	U extends WhereConstraint<T, string, WhereFilterOp, unknown>,
	PreviousQCs extends readonly QueryConstraints<T>[]
> = U['_op'] extends NotIn
	? Extract<
			GetAllWhereConstraintOpStr<T, PreviousQCs, never>,
			NotEqual | In | ArrayContainsAny | Or
	  > extends never
		? true
		: ErrorWhereNotIn
	: U['_op'] extends NotEqual | In | ArrayContainsAny | Or
	? Extract<
			GetAllWhereConstraintOpStr<T, PreviousQCs, never>,
			NotIn
	  > extends never
		? true
		: ErrorWhereNotIn
	: true

// You cannot use more than one '!=' filter. (undocumented)
type ValidateWhereNotEqual<
	T extends MetaType,
	U extends WhereConstraint<T, string, WhereFilterOp, unknown>,
	PreviousQCs extends readonly QueryConstraints<T>[]
> = U['_op'] extends NotEqual
	? Extract<
			GetAllWhereConstraintOpStr<T, PreviousQCs, never>,
			NotEqual
	  > extends never
		? true
		: ErrorWhereOnlyOneNotEqual
	: true

// You can use at most one array-contains or array-contains-any clause per query. You can't combine array-contains with array-contains-any.
export type ValidateWhereArrayContainsArrayContainsAny<
	T extends MetaType,
	U extends WhereConstraint<T, string, WhereFilterOp, unknown>,
	PreviousQCs extends readonly QueryConstraints<T>[]
> = U['_op'] extends ArrayContains
	? Extract<
			GetAllWhereConstraintOpStr<T, PreviousQCs, never>,
			ArrayContains | ArrayContainsAny
	  > extends never
		? true
		: ErrorWhereArrayContainsArrayContainsAny
	: U['_op'] extends ArrayContainsAny
	? Extract<
			GetAllWhereConstraintOpStr<T, PreviousQCs, never>,
			ArrayContains | ArrayContainsAny
	  > extends never
		? true
		: ErrorWhereArrayContainsArrayContainsAny
	: true

// In a compound query, range (<, <=, >, >=) and not equals (!=, not-in) comparisons must all filter on the same field.
type ValidateWhereInequalityOpStrSameField<
	T extends MetaType,
	U extends WhereConstraint<T, string, WhereFilterOp, unknown>,
	PreviousQCs extends readonly QueryConstraints<T>[]
> = U['_op'] extends InequalityOpStr
	? Extract<
			GetAllWhereConstraint<T, PreviousQCs, never>,
			WhereConstraint<T, string, InequalityOpStr, unknown>
	  > extends never
		? true
		: Exclude<
				Extract<
					GetAllWhereConstraint<T, PreviousQCs, never>,
					WhereConstraint<T, string, InequalityOpStr, unknown>
				>,
				WhereConstraint<T, U['_field'], InequalityOpStr, unknown>
		  > extends never
		? true
		: ErrorWhereInequalityOpStrSameField
	: true

export type GetFirstInequalityWhere<
	T extends MetaType,
	QCs extends readonly QueryConstraints<T>[]
> = QCs extends [infer H, ...infer Rest extends readonly QueryConstraints<T>[]]
	? H extends WhereConstraint<T, string, InequalityOpStr, unknown>
		? H
		: GetFirstInequalityWhere<T, Rest>
	: true // not found, no check needed

export type GetAllWhereConstraint<
	T extends MetaType,
	AllQCs extends readonly QueryConstraints<T>[],
	WhereConstraintsAcc extends WhereConstraint<T, string, WhereFilterOp, unknown>
> = AllQCs extends [infer H, ...infer R]
	? R extends readonly QueryConstraints<T>[]
		?
				| WhereConstraintsAcc
				| GetAllWhereConstraint<
						T,
						R,
						| (H extends WhereConstraint<T, string, WhereFilterOp, unknown>
								? H
								: never)
						| WhereConstraintsAcc
				  >
		: WhereConstraintsAcc // R is []
	: WhereConstraintsAcc // QCs is []

type GetAllWhereConstraintOpStr<
	T extends MetaType,
	QCs extends readonly QueryConstraints<T>[],
	OpStrAcc extends WhereFilterOp
> = QCs extends [infer H, ...infer R]
	? R extends readonly QueryConstraints<T>[]
		?
				| OpStrAcc
				| GetAllWhereConstraintOpStr<
						T,
						R,
						| (H extends WhereConstraint<T, string, WhereFilterOp, unknown>
								? H['_op']
								: never)
						| OpStrAcc
				  >
		: OpStrAcc // R is []
	: OpStrAcc // QCs is []

export type WhereConstraintLimitation<
	T extends MetaType,
	Q extends Query<T>,
	U extends WhereConstraint<T, string, WhereFilterOp, unknown>,
	PreviousQCs extends readonly QueryConstraints<T>[]
> = ValidateWhereNotIn<T, U, PreviousQCs> extends infer R extends string
	? R
	: ValidateWhereNotEqual<T, U, PreviousQCs> extends infer P extends string
	? P
	: ValidateWhereInequalityOpStrSameField<
			T,
			U,
			PreviousQCs
	  > extends infer K extends string
	? K
	: U['_op'] extends ValueOfOptStr
	? WhereConstraint<
			T,
			U['_field'],
			U['_op'],
			GetCorrectDocumentIdBasedOnRef<T, Q, U['_field'], U['_value']>
	  >
	: U['_op'] extends ArrayOfOptStr
	? WhereConstraint<
			T,
			U['_field'],
			U['_op'],
			U['_value'] extends readonly never[]
				? ErrorWhereNoNeverEmptyArray
				: U['_value'] extends readonly (infer P)[]
				? readonly GetCorrectDocumentIdBasedOnRef<T, Q, U['_field'], P>[]
				: ErrorWhereInOrNotInValueIsNotArray<U['_field']>
	  >
	: U['_op'] extends ValueOfOnlyArrayOptStr
	? WhereConstraint<
			T,
			U['_field'],
			U['_op'],
			U['_value'] extends readonly never[]
				? ErrorWhereNoNeverEmptyArray
				: DeepValue<T['compare'], U['_field']> extends readonly unknown[]
				? DeepValue<T['compare'], U['_field']>
				: ErrorWhereCompareValueMustBeArray<U['_field']>
	  >
	: U['_op'] extends ElementOfOptStr
	? WhereConstraint<
			T,
			U['_field'],
			U['_op'],
			DeepValue<T['compare'], U['_field']> extends readonly (infer R)[]
				? R
				: ErrorWhereCompareValueMustBeArray<U['_field']>
	  >
	: never // impossible route
