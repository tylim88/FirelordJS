import { MetaType } from '../metaTypeCreator'
import { WhereFilterOp } from '../alias'
import {
	ErrorWhereCompareValueMustBeArray,
	ErrorWhereNotInArrayContainsAny,
	ErrorWhereNotInNotEqual,
	ErrorWhereArrayContainsArrayContainsAny,
	ErrorWhereInequalityOpStrSameField,
	ErrorWhereOnlyOneNotEqual,
	ErrorWhereNoNeverEmptyArray,
	ErrorWhereInOrNotInValueIsNotArray,
} from '../error'
import { QueryConstraints, WhereConstraint } from '../queryConstraints'
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
} from './utils'

// You can use at most one in, not-in, or array-contains-any clause per query. You can't combine in , not-in, and array-contains-any in the same query.
type ValidateWhereNotInArrayContainsAny<
	T extends MetaType,
	U extends WhereConstraint<T, string, WhereFilterOp, unknown>,
	PreviousQCs extends QueryConstraints<T>[]
> = U['opStr'] extends In | NotIn | ArrayContainsAny
	? Extract<
			GetAllWhereConstraintOpStr<T, PreviousQCs, never>,
			In | NotIn | ArrayContainsAny
	  > extends never
		? true
		: ErrorWhereNotInArrayContainsAny
	: true

// You can't combine not-in with not equals !=.
// You cannot use more than one '!=' filter. (not documented directly or indirectly)
type ValidateWhereNotInNotEqual<
	T extends MetaType,
	U extends WhereConstraint<T, string, WhereFilterOp, unknown>,
	PreviousQCs extends QueryConstraints<T>[]
> = U['opStr'] extends NotIn
	? Extract<
			GetAllWhereConstraintOpStr<T, PreviousQCs, never>,
			NotEqual
	  > extends never
		? true
		: ErrorWhereNotInNotEqual
	: U['opStr'] extends NotEqual
	? Extract<
			GetAllWhereConstraintOpStr<T, PreviousQCs, never>,
			NotIn
	  > extends never
		? Extract<
				GetAllWhereConstraintOpStr<T, PreviousQCs, never>,
				NotEqual
		  > extends never
			? true
			: ErrorWhereOnlyOneNotEqual
		: ErrorWhereNotInNotEqual
	: true

// You can use at most one array-contains clause per query. You can't combine array-contains with array-contains-any.
type ValidateWhereArrayContainsArrayContainsAny<
	T extends MetaType,
	U extends WhereConstraint<T, string, WhereFilterOp, unknown>,
	PreviousQCs extends QueryConstraints<T>[]
> = U['opStr'] extends ArrayContains
	? Extract<
			GetAllWhereConstraintOpStr<T, PreviousQCs, never>,
			ArrayContains | ArrayContainsAny
	  > extends never
		? true
		: ErrorWhereArrayContainsArrayContainsAny
	: U['opStr'] extends ArrayContainsAny
	? Extract<
			GetAllWhereConstraintOpStr<T, PreviousQCs, never>,
			ArrayContains
	  > extends never
		? true
		: ErrorWhereArrayContainsArrayContainsAny
	: true

// In a compound query, range (<, <=, >, >=) and not equals (!=, not-in) comparisons must all filter on the same field.
type ValidateWhereInequalityOpStrSameField<
	T extends MetaType,
	U extends WhereConstraint<T, string, WhereFilterOp, unknown>,
	PreviousQCs extends QueryConstraints<T>[]
> = U['opStr'] extends InequalityOpStr
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
				WhereConstraint<T, U['fieldPath'], InequalityOpStr, unknown>
		  > extends never
		? true
		: ErrorWhereInequalityOpStrSameField
	: true

export type GetFirstInequalityWhere<
	T extends MetaType,
	QCs extends QueryConstraints<T>[]
> = QCs extends [infer H, ...infer Rest]
	? H extends WhereConstraint<T, string, InequalityOpStr, unknown>
		? H
		: Rest extends QueryConstraints<T>[]
		? GetFirstInequalityWhere<T, Rest>
		: never // impossible route
	: true // not found, no check needed

export type GetAllWhereConstraint<
	T extends MetaType,
	QCs extends QueryConstraints<T>[],
	WhereConstraintsAcc extends WhereConstraint<T, string, WhereFilterOp, unknown>
> = QCs extends [infer H, ...infer R]
	? R extends QueryConstraints<T>[]
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
	QCs extends QueryConstraints<T>[],
	OpStrAcc extends WhereFilterOp
> = QCs extends [infer H, ...infer R]
	? R extends QueryConstraints<T>[]
		?
				| OpStrAcc
				| GetAllWhereConstraintOpStr<
						T,
						R,
						| (H extends WhereConstraint<T, string, WhereFilterOp, unknown>
								? H['opStr']
								: never)
						| OpStrAcc
				  >
		: OpStrAcc // R is []
	: OpStrAcc // QCs is []

export type WhereConstraintLimitation<
	T extends MetaType,
	Q extends Query<T>,
	U extends WhereConstraint<T, string, WhereFilterOp, unknown>,
	PreviousQCs extends QueryConstraints<T>[]
> = ValidateWhereNotInArrayContainsAny<T, U, PreviousQCs> extends string
	? ValidateWhereNotInArrayContainsAny<T, U, PreviousQCs>
	: ValidateWhereNotInNotEqual<T, U, PreviousQCs> extends string
	? ValidateWhereNotInNotEqual<T, U, PreviousQCs>
	: ValidateWhereArrayContainsArrayContainsAny<T, U, PreviousQCs> extends string
	? ValidateWhereArrayContainsArrayContainsAny<T, U, PreviousQCs>
	: ValidateWhereInequalityOpStrSameField<T, U, PreviousQCs> extends string
	? ValidateWhereInequalityOpStrSameField<T, U, PreviousQCs>
	: U['opStr'] extends ValueOfOptStr
	? WhereConstraint<
			T,
			U['fieldPath'],
			U['opStr'],
			GetCorrectDocumentIdBasedOnRef<T, Q, U['fieldPath'], U['value']>
	  >
	: U['opStr'] extends ArrayOfOptStr
	? WhereConstraint<
			T,
			U['fieldPath'],
			U['opStr'],
			U['value'] extends readonly never[] | readonly []
				? ErrorWhereNoNeverEmptyArray
				: U['value'] extends readonly (infer P)[]
				? readonly GetCorrectDocumentIdBasedOnRef<T, Q, U['fieldPath'], P>[]
				: ErrorWhereInOrNotInValueIsNotArray<U['fieldPath']>
	  >
	: U['opStr'] extends ValueOfOnlyArrayOptStr
	? WhereConstraint<
			T,
			U['fieldPath'],
			U['opStr'],
			U['value'] extends readonly never[] | readonly []
				? ErrorWhereNoNeverEmptyArray
				: T['compare'][U['fieldPath']] extends readonly unknown[]
				? T['compare'][U['fieldPath']]
				: ErrorWhereCompareValueMustBeArray<U['fieldPath']>
	  >
	: U['opStr'] extends ElementOfOptStr
	? WhereConstraint<
			T,
			U['fieldPath'],
			U['opStr'],
			T['compare'][U['fieldPath']] extends readonly (infer R)[]
				? R
				: ErrorWhereCompareValueMustBeArray<U['fieldPath']>
	  >
	: never // impossible route
