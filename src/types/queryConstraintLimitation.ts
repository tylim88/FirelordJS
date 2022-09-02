import { MetaType } from './metaTypeCreator'
import { WhereFilterOp, OrderByDirection } from './alias'
import {
	ErrorLimitToLastOrderBy,
	ErrorWhereOrderByAndInEquality,
	ErrorWhereCompareValueMustBeArray,
	ErrorWhereOrderByEquality,
	ErrorWhereNotInArrayContainsAny,
	ErrorWhereNotInNotEqual,
	ErrorWhereArrayContainsArrayContainsAny,
	ErrorWhereInequalityOpStrSameField,
	ErrorWhereOnlyOneNotEqual,
	ErrorCursorTooManyArguments,
	ErrorWhereNoNeverEmptyArray,
	ErrorCursor__name__,
} from './error'
import { IsSame, IsTrue } from './utils'
import {
	QueryConstraints,
	WhereConstraint,
	OrderByConstraint,
	CursorConstraint,
	LimitConstraint,
} from './queryConstraints'
import { Query } from './refs'
import {
	GetCorrectDocumentIdBasedOnRef,
	RemoveSentinelFieldPathFromCompare,
	__name__,
} from './fieldPath'
import { CursorType } from './cursor'
import { QueryDocumentSnapshot, DocumentSnapshot } from './snapshot'

type Equal = '=='
type Greater = '>'
type Smaller = '<'
type GreaterEqual = '>='
type SmallerEqual = '<='
type Range = Greater | Smaller | Greater | GreaterEqual | SmallerEqual
type NotEqual = '!='
type NotIn = 'not-in'
type In = 'in'
type ArrayContains = 'array-contains'
type ArrayContainsAny = 'array-contains-any'
type InequalityOpStr = Range | NotEqual | NotIn
type ValueOfOptStr = Range | NotEqual | Equal
type ArrayOfOptStr = In | NotIn
type ValueOfOnlyArrayOptStr = ArrayContainsAny
type ElementOfOptStr = ArrayContains
IsTrue<
	IsSame<
		WhereFilterOp,
		| InequalityOpStr
		| ValueOfOptStr
		| ArrayOfOptStr
		| ValueOfOnlyArrayOptStr
		| ElementOfOptStr
	>
>()

// If you include a filter with a range comparison (<, <=, >, >=), your first ordering must be on the same field
type ValidateOrderByAndInequalityWhere<
	T extends MetaType,
	AllQCs extends QueryConstraints<T>[]
> = GetFirstInequalityWhere<T, AllQCs> extends infer W
	? W extends WhereConstraint<T, string, InequalityOpStr, unknown>
		? GetFirstOrderBy<T, AllQCs> extends infer O
			? O extends OrderByConstraint<string, OrderByDirection | undefined>
				? IsSame<W['fieldPath'], O['fieldPath']> extends true
					? true
					: ErrorWhereOrderByAndInEquality<O['fieldPath'], W['fieldPath']>
				: true // orderBy not found
			: never // impossible route
		: true // inequality Where not found
	: never // impossible route

export type QueryConstraintLimitation<
	T extends MetaType,
	Q extends Query<T>,
	RestQCs extends QueryConstraints<T>[],
	PreviousQCs extends QueryConstraints<T>[],
	AllQCs extends QueryConstraints<T>[]
> = ValidateOrderByAndInequalityWhere<T, AllQCs> extends string
	? ValidateOrderByAndInequalityWhere<T, AllQCs>
	: RestQCs extends [infer Head, ...infer Rest]
	? Rest extends QueryConstraints<T>[]
		? [
				Head extends LimitConstraint<'limit', number>
					? Head
					: Head extends OrderByConstraint<string, OrderByDirection | undefined>
					? OrderByConstraintLimitation<T, Head, AllQCs>
					: Head extends LimitConstraint<'limitToLast', number>
					? LimitToLastConstraintLimitation<T, Head, AllQCs>
					: Head extends WhereConstraint<T, string, WhereFilterOp, unknown>
					? WhereConstraintLimitation<T, Q, Head, PreviousQCs>
					: Head extends CursorConstraint<CursorType, unknown[]>
					? CursorConstraintLimitation<T, Head, PreviousQCs>
					: never, // impossible route
				...QueryConstraintLimitation<
					T,
					Q,
					Rest,
					Head extends QueryConstraints<T>
						? [...PreviousQCs, Head]
						: PreviousQCs, // impossible route
					AllQCs
				>
		  ]
		: never[] // impossible route
	: RestQCs // basically mean RestQCs is []

// Too many arguments provided to startAt(). The number of arguments must be less than or equal to the number of orderBy() clauses
type ValidateCursorOrderBy<
	T extends MetaType,
	Values extends unknown[],
	AllOrderBy extends OrderByConstraint<string, OrderByDirection | undefined>[]
> = Values extends [infer Head, ...infer Rest]
	? AllOrderBy extends [infer H, ...infer R]
		? H extends OrderByConstraint<string, OrderByDirection | undefined>
			? [
					H['fieldPath'] extends __name__
						? string extends Head
							? ErrorCursor__name__
							: T['docPath']
						: Head extends
								| T['compare'][H['fieldPath']]
								| QueryDocumentSnapshot<T>
								| DocumentSnapshot<T>
						? Head | QueryDocumentSnapshot<T> | DocumentSnapshot<T>
						:
								| T['compare'][H['fieldPath']]
								| QueryDocumentSnapshot<T>
								| DocumentSnapshot<T>,
					...ValidateCursorOrderBy<
						T,
						Rest,
						R extends OrderByConstraint<string, OrderByDirection | undefined>[]
							? R
							: []
					>
			  ]
			: never // impossible route
		: [ErrorCursorTooManyArguments]
	: [] // end, Rest is []

type CursorConstraintLimitation<
	T extends MetaType,
	U extends CursorConstraint<CursorType, unknown[]>,
	PreviousQCs extends QueryConstraints<T>[]
> = CursorConstraint<
	CursorType,
	ValidateCursorOrderBy<
		RemoveSentinelFieldPathFromCompare<T>,
		U['values'],
		GetAllOrderBy<T, PreviousQCs, []>
	>
>

type LimitToLastConstraintLimitation<
	T extends MetaType,
	U extends LimitConstraint<'limitToLast', number>,
	AllQCs extends QueryConstraints<T>[]
> = AllQCs extends (infer A)[]
	? A extends QueryConstraints<T>
		? A['type'] extends 'orderBy'
			? U
			: ErrorLimitToLastOrderBy
		: never // impossible route
	: never // impossible route

// You can't order your query by a field included in an equality (==) or (in) clause.
type ValidateOrderByEqualityWhere<
	T extends MetaType,
	U extends OrderByConstraint<string, OrderByDirection | undefined>,
	AllQCs extends QueryConstraints<T>[]
> = Extract<
	GetAllWhereConstraint<T, AllQCs, never>,
	WhereConstraint<T, U['fieldPath'], In | Equal, unknown>
> extends never
	? true
	: false

type OrderByConstraintLimitation<
	T extends MetaType,
	U extends OrderByConstraint<string, OrderByDirection | undefined>,
	AllQCs extends QueryConstraints<T>[]
> = ValidateOrderByEqualityWhere<T, U, AllQCs> extends false
	? ErrorWhereOrderByEquality
	: U

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

type WhereConstraintLimitation<
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
			U['value'] extends never[]
				? ErrorWhereNoNeverEmptyArray
				: U['value'] extends (infer P)[]
				? GetCorrectDocumentIdBasedOnRef<T, Q, U['fieldPath'], P>[]
				: ErrorWhereCompareValueMustBeArray<U['fieldPath']>
	  >
	: U['opStr'] extends ValueOfOnlyArrayOptStr
	? WhereConstraint<
			T,
			U['fieldPath'],
			U['opStr'],
			U['value'] extends never[]
				? ErrorWhereNoNeverEmptyArray
				: T['compare'][U['fieldPath']] extends unknown[]
				? T['compare'][U['fieldPath']]
				: ErrorWhereCompareValueMustBeArray<U['fieldPath']>
	  >
	: U['opStr'] extends ElementOfOptStr
	? WhereConstraint<
			T,
			U['fieldPath'],
			U['opStr'],
			T['compare'][U['fieldPath']] extends (infer R)[]
				? R
				: ErrorWhereCompareValueMustBeArray<U['fieldPath']>
	  >
	: never // impossible route

type GetFirstInequalityWhere<
	T extends MetaType,
	QCs extends QueryConstraints<T>[]
> = QCs extends [infer H, ...infer Rest]
	? H extends WhereConstraint<T, string, InequalityOpStr, unknown>
		? H
		: Rest extends QueryConstraints<T>[]
		? GetFirstInequalityWhere<T, Rest>
		: never // impossible route
	: true // not found, no check needed

type GetFirstOrderBy<
	T extends MetaType,
	QCs extends QueryConstraints<T>[]
> = QCs extends [infer H, ...infer Rest]
	? H extends OrderByConstraint<string, OrderByDirection | undefined>
		? H
		: Rest extends QueryConstraints<T>[]
		? GetFirstOrderBy<T, Rest>
		: never // impossible route
	: true // not found, no check needed

type GetAllOrderBy<
	T extends MetaType,
	QCs extends QueryConstraints<T>[],
	AllOrderBy extends OrderByConstraint<string, OrderByDirection | undefined>[]
> = QCs extends [infer H, ...infer Rest]
	? Rest extends QueryConstraints<T>[]
		? GetAllOrderBy<
				T,
				Rest,
				H extends OrderByConstraint<string, OrderByDirection | undefined>
					? [...AllOrderBy, H]
					: AllOrderBy
		  >
		: [] // impossible route
	: AllOrderBy // not found, no check needed

type GetAllWhereConstraint<
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
