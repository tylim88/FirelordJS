import { MetaTypes } from './metaTypeCreator'
import { FirelordFirestore } from './firelordFirestore'
import {
	ErrorLimitToLastOrderBy,
	ErrorInvalidWhereCompareValue,
	ErrorOrderByAndInEqualityWhere,
	ErrorInvalidWhereCompareValueArrayVersion,
	ErrorInvalidWhereCompareValueMustBeArray,
	ErrorInvalidWhereFieldValueMustBeElementOfArray,
	ErrorOrderByEqualityWhere,
	ErrorWhereNotInArrayContainsAny,
	ErrorWhereNotInNotEqual,
	ErrorWhereArrayContainsArrayContainsAny,
	ErrorWhereInequalityOpStrSameField,
	ErrorWhereOnlyOneNotEqual,
	ErrorCursorTooManyArguments,
} from './error'
import { IsSame, IsTrue } from './utils'
import {
	QueryConstraints,
	WhereConstraint,
	OrderByConstraint,
	CursorConstraint,
	LimitConstraint,
} from './queryConstraints'
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
		FirelordFirestore.WhereFilterOp,
		| InequalityOpStr
		| ValueOfOptStr
		| ArrayOfOptStr
		| ValueOfOnlyArrayOptStr
		| ElementOfOptStr
	>
>()

// If you include a filter with a range comparison (<, <=, >, >=), your first ordering must be on the same field
type ValidateOrderByAndInequalityWhere<
	T extends MetaTypes,
	AllQCs extends QueryConstraints<T>[]
> = GetFirstInequalityWhere<T, AllQCs> extends infer W
	? W extends WhereConstraint<string, InequalityOpStr, unknown>
		? GetFirstOrderBy<T, AllQCs> extends infer O
			? O extends OrderByConstraint<
					string,
					FirelordFirestore.OrderByDirection | undefined
			  >
				? IsSame<W['fieldPath'], O['fieldPath']> extends true
					? true
					: ErrorOrderByAndInEqualityWhere<O['fieldPath'], W['fieldPath']>
				: true // orderBy not found
			: never // impossible route
		: true // inequality Where not found
	: never // impossible route

export type QueryConstraintLimitation<
	T extends MetaTypes,
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
					: Head extends OrderByConstraint<
							string,
							FirelordFirestore.OrderByDirection | undefined
					  >
					? OrderByConstraintLimitation<T, Head, AllQCs>
					: Head extends LimitConstraint<'limitToLast', number>
					? LimitToLastConstraintLimitation<T, Head, AllQCs>
					: Head extends WhereConstraint<
							string,
							FirelordFirestore.WhereFilterOp,
							unknown
					  >
					? WhereConstraintLimitation<T, Head, PreviousQCs>
					: Head extends CursorConstraint<unknown[]>
					? CursorConstraintLimitation<T, Head, PreviousQCs>
					: never, // impossible route
				...QueryConstraintLimitation<
					T,
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
	Values extends unknown[],
	AllOrderFieldValue extends unknown[]
> = Values extends [infer Head, ...infer Rest]
	? AllOrderFieldValue extends [infer H, ...infer R]
		? [Head extends H ? Head : H, ...ValidateCursorOrderBy<Rest, R>]
		: [ErrorCursorTooManyArguments]
	: [] // end, Rest is []

type CursorConstraintLimitation<
	T extends MetaTypes,
	U extends CursorConstraint<unknown[]>,
	PreviousQCs extends QueryConstraints<T>[]
> = U extends CursorConstraint<
	ValidateCursorOrderBy<
		U['values'],
		GetAllOrderByFieldValue<T, PreviousQCs, []>
	>
>
	? U
	: ErrorCursorTooManyArguments

type LimitToLastConstraintLimitation<
	T extends MetaTypes,
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
	T extends MetaTypes,
	U extends OrderByConstraint<
		string,
		FirelordFirestore.OrderByDirection | undefined
	>,
	AllQCs extends QueryConstraints<T>[]
> = Extract<
	GetAllWhereConstraint<T, AllQCs, never>,
	WhereConstraint<U['fieldPath'], In | Equal, unknown>
> extends never
	? true
	: false

type OrderByConstraintLimitation<
	T extends MetaTypes,
	U extends OrderByConstraint<
		string,
		FirelordFirestore.OrderByDirection | undefined
	>,
	AllQCs extends QueryConstraints<T>[]
> = ValidateOrderByEqualityWhere<T, U, AllQCs> extends false
	? ErrorOrderByEqualityWhere
	: U

// You can use at most one in, not-in, or array-contains-any clause per query. You can't combine in , not-in, and array-contains-any in the same query.
type ValidateWhereNotInArrayContainsAny<
	T extends MetaTypes,
	U extends WhereConstraint<string, FirelordFirestore.WhereFilterOp, unknown>,
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
	T extends MetaTypes,
	U extends WhereConstraint<string, FirelordFirestore.WhereFilterOp, unknown>,
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
	T extends MetaTypes,
	U extends WhereConstraint<string, FirelordFirestore.WhereFilterOp, unknown>,
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
	T extends MetaTypes,
	U extends WhereConstraint<string, FirelordFirestore.WhereFilterOp, unknown>,
	PreviousQCs extends QueryConstraints<T>[]
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

type WhereConstraintLimitation<
	T extends MetaTypes,
	U extends WhereConstraint<string, FirelordFirestore.WhereFilterOp, unknown>,
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
	? U['value'] extends T['compare'][U['fieldPath']]
		? U
		: ErrorInvalidWhereCompareValue
	: U['opStr'] extends ArrayOfOptStr
	? U['value'] extends T['compare'][U['fieldPath']][]
		? U
		: U['value'] extends T['compare'][U['fieldPath']]
		? ErrorInvalidWhereCompareValueArrayVersion
		: ErrorInvalidWhereCompareValue
	: U['opStr'] extends ValueOfOnlyArrayOptStr
	? U['value'] extends T['compare'][U['fieldPath']]
		? T['compare'][U['fieldPath']] extends (infer R)[]
			? U
			: ErrorInvalidWhereCompareValueMustBeArray
		: ErrorInvalidWhereCompareValue
	: U['opStr'] extends ElementOfOptStr
	? T['compare'][U['fieldPath']] extends (infer R)[]
		? U['value'] extends R
			? U
			: ErrorInvalidWhereFieldValueMustBeElementOfArray
		: ErrorInvalidWhereCompareValueMustBeArray
	: never // impossible route

type GetFirstInequalityWhere<
	T extends MetaTypes,
	QCs extends QueryConstraints<T>[]
> = QCs extends [infer H, ...infer Rest]
	? H extends WhereConstraint<string, InequalityOpStr, unknown>
		? H
		: Rest extends QueryConstraints<T>[]
		? GetFirstInequalityWhere<T, Rest>
		: never // impossible route
	: true // not found, no check needed

type GetFirstOrderBy<
	T extends MetaTypes,
	QCs extends QueryConstraints<T>[]
> = QCs extends [infer H, ...infer Rest]
	? H extends OrderByConstraint<
			string,
			FirelordFirestore.OrderByDirection | undefined
	  >
		? H
		: Rest extends QueryConstraints<T>[]
		? GetFirstOrderBy<T, Rest>
		: never // impossible route
	: true // not found, no check needed

type GetAllOrderByFieldValue<
	T extends MetaTypes,
	QCs extends QueryConstraints<T>[],
	FieldValueTypeAcc extends unknown[]
> = QCs extends [infer H, ...infer Rest]
	? Rest extends QueryConstraints<T>[]
		? GetAllOrderByFieldValue<
				T,
				Rest,
				H extends OrderByConstraint<
					string,
					FirelordFirestore.OrderByDirection | undefined
				>
					? [...FieldValueTypeAcc, T['compare'][H['fieldPath']]]
					: FieldValueTypeAcc
		  >
		: [] // impossible route
	: FieldValueTypeAcc // not found, no check needed

type GetAllWhereConstraint<
	T extends MetaTypes,
	QCs extends QueryConstraints<T>[],
	WhereConstraintsAcc extends WhereConstraint<
		string,
		FirelordFirestore.WhereFilterOp,
		unknown
	>
> = QCs extends [infer H, ...infer R]
	? R extends QueryConstraints<T>[]
		?
				| WhereConstraintsAcc
				| GetAllWhereConstraint<
						T,
						R,
						| (H extends WhereConstraint<
								string,
								FirelordFirestore.WhereFilterOp,
								unknown
						  >
								? H
								: never)
						| WhereConstraintsAcc
				  >
		: WhereConstraintsAcc // R is []
	: WhereConstraintsAcc // QCs is []

type GetAllWhereConstraintOpStr<
	T extends MetaTypes,
	QCs extends QueryConstraints<T>[],
	OpStrAcc extends FirelordFirestore.WhereFilterOp
> = QCs extends [infer H, ...infer R]
	? R extends QueryConstraints<T>[]
		?
				| OpStrAcc
				| GetAllWhereConstraintOpStr<
						T,
						R,
						| (H extends WhereConstraint<
								string,
								FirelordFirestore.WhereFilterOp,
								unknown
						  >
								? H['opStr']
								: never)
						| OpStrAcc
				  >
		: OpStrAcc // R is []
	: OpStrAcc // QCs is []
