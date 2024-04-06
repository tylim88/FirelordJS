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
import { QueryConstraints, WhereConstraint } from '../queryConstraints'
import { GeneralQuery } from '../refs'
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
	U extends WhereConstraint<string, WhereFilterOp, unknown>,
	PreviousQCs extends readonly QueryConstraints[]
> = U['opStr'] extends NotIn
	? Extract<
			GetAllWhereConstraintOpStr<T, PreviousQCs, never>,
			NotEqual | In | ArrayContainsAny | Or
	  > extends never
		? true
		: ErrorWhereNotIn
	: U['opStr'] extends NotEqual | In | ArrayContainsAny | Or
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
	U extends WhereConstraint<string, WhereFilterOp, unknown>,
	PreviousQCs extends readonly QueryConstraints[]
> = U['opStr'] extends NotEqual
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
	U extends WhereConstraint<string, WhereFilterOp, unknown>,
	PreviousQCs extends readonly QueryConstraints[]
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
			ArrayContains | ArrayContainsAny
	  > extends never
		? true
		: ErrorWhereArrayContainsArrayContainsAny
	: true

// In a compound query, range (<, <=, >, >=) and not equals (!=, not-in) comparisons must all filter on the same field.
type ValidateWhereInequalityOpStrSameField<
	T extends MetaType,
	U extends WhereConstraint<string, WhereFilterOp, unknown>,
	PreviousQCs extends readonly QueryConstraints[]
> = U['opStr'] extends InequalityOpStr
	? Extract<
			GetAllWhereConstraint<T, PreviousQCs, never>,
			WhereConstraint<string, InequalityOpStr, unknown>
	  > extends never
		? true
		: Exclude<
				Extract<
					GetAllWhereConstraint<T, PreviousQCs, never>,
					WhereConstraint<string, InequalityOpStr, unknown>
				>,
				WhereConstraint<U['fieldPath'], InequalityOpStr, unknown>
		  > extends never
		? true
		: ErrorWhereInequalityOpStrSameField
	: true

export type GetFirstInequalityWhere<
	T extends MetaType,
	QCs extends readonly QueryConstraints[]
> = QCs extends [infer H, ...infer Rest extends readonly QueryConstraints[]]
	? H extends WhereConstraint<string, InequalityOpStr, unknown>
		? H
		: GetFirstInequalityWhere<T, Rest>
	: true // not found, no check needed

export type GetAllWhereConstraint<
	T extends MetaType,
	AllQCs extends readonly QueryConstraints[],
	WhereConstraintsAcc extends WhereConstraint<string, WhereFilterOp, unknown>
> = AllQCs extends [infer H, ...infer R]
	? R extends readonly QueryConstraints[]
		?
				| WhereConstraintsAcc
				| GetAllWhereConstraint<
						T,
						R,
						| (H extends WhereConstraint<string, WhereFilterOp, unknown>
								? H
								: never)
						| WhereConstraintsAcc
				  >
		: WhereConstraintsAcc // R is []
	: WhereConstraintsAcc // QCs is []

type GetAllWhereConstraintOpStr<
	T extends MetaType,
	QCs extends readonly QueryConstraints[],
	OpStrAcc extends WhereFilterOp
> = QCs extends [infer H, ...infer R]
	? R extends readonly QueryConstraints[]
		?
				| OpStrAcc
				| GetAllWhereConstraintOpStr<
						T,
						R,
						| (H extends WhereConstraint<string, WhereFilterOp, unknown>
								? H['opStr']
								: never)
						| OpStrAcc
				  >
		: OpStrAcc // R is []
	: OpStrAcc // QCs is []

export type WhereConstraintLimitation<
	T extends MetaType,
	Q extends GeneralQuery<T>,
	U extends WhereConstraint<string, WhereFilterOp, unknown>,
	PreviousQCs extends readonly QueryConstraints[]
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
	: U['opStr'] extends ValueOfOptStr
	? WhereConstraint<
			U['fieldPath'],
			U['opStr'],
			GetCorrectDocumentIdBasedOnRef<T, Q, U['fieldPath'], U['value']>
	  >
	: U['opStr'] extends ArrayOfOptStr
	? WhereConstraint<
			U['fieldPath'],
			U['opStr'],
			U['value'] extends readonly never[]
				? ErrorWhereNoNeverEmptyArray
				: U['value'] extends readonly (infer P)[]
				? readonly GetCorrectDocumentIdBasedOnRef<T, Q, U['fieldPath'], P>[]
				: ErrorWhereInOrNotInValueIsNotArray<U['fieldPath']>
	  >
	: U['opStr'] extends ValueOfOnlyArrayOptStr
	? WhereConstraint<
			U['fieldPath'],
			U['opStr'],
			U['value'] extends readonly never[]
				? ErrorWhereNoNeverEmptyArray
				: DeepValue<T['compare'], U['fieldPath']> extends readonly unknown[]
				? DeepValue<T['compare'], U['fieldPath']>
				: ErrorWhereCompareValueMustBeArray<U['fieldPath']>
	  >
	: U['opStr'] extends ElementOfOptStr
	? WhereConstraint<
			U['fieldPath'],
			U['opStr'],
			DeepValue<T['compare'], U['fieldPath']> extends readonly (infer R)[]
				? R
				: ErrorWhereCompareValueMustBeArray<U['fieldPath']>
	  >
	: never // impossible route
