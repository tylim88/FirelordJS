import { MetaType } from '../metaTypeCreator'
import { WhereFilterOp } from '../alias'
import {
	WhereConstraint,
	OrderByConstraint,
	CursorConstraint,
	LimitConstraint,
	QueryFilterConstraints,
	QueryConstraints,
	QueryAllConstraints,
	CursorType,
	QueryCompositeFilterConstraint,
} from '../queryConstraints'
import { GeneralQuery } from '../refs'
import { WhereConstraintLimitation } from './where'
import {
	ErrorOrAndInvalidConstraints,
	ErrorInvalidTopLevelFilter,
	ErrorCannotUseNotInOrQuery,
} from '../error'
import { NotIn } from './utils'

type GetAllQueryFilterCompositeConstraint<
	T extends MetaType,
	QQCs extends readonly QueryAllConstraints[],
	QueryCompositeConstraintAcc extends QueryCompositeFilterConstraint<
		'and' | 'or',
		QueryFilterConstraints[]
	>
> = QQCs extends [infer H, ...infer R extends QueryAllConstraints[]]
	?
			| QueryCompositeConstraintAcc
			| GetAllQueryFilterCompositeConstraint<
					T,
					R,
					| (H extends QueryCompositeFilterConstraint<
							'and' | 'or',
							QueryFilterConstraints[]
					  >
							? H
							: never)
					| QueryCompositeConstraintAcc
			  >
	: QueryCompositeConstraintAcc // QCs is []

// `Error: When using composite filters, you cannot use more than one filter('and' 'when' 'or') at the top level. Consider nesting the multiple filters within an 'and(...)' statement. For example: change 'query(query, where(...), or(...))' to 'query(query, and(where(...), or(...)))'.`
// check where + or/and
export type ValidateTopLevelQueryCompositeFilterPartOne<
	T extends MetaType,
	AllQQCs extends readonly QueryAllConstraints[]
> = AllQQCs extends (infer P)[]
	? Extract<P, WhereConstraint<string, WhereFilterOp, unknown>> extends never
		? true
		: GetAllQueryFilterCompositeConstraint<T, AllQQCs, never> extends never
		? true
		: ErrorInvalidTopLevelFilter
	: true

// `Error: When using composite filters, you cannot use more than one filter('and' 'when' 'or') at the top level. Consider nesting the multiple filters within an 'and(...)' statement. For example: change 'query(query, where(...), or(...))' to 'query(query, and(where(...), or(...)))'.`
// check or/and + or/and
export type ValidateTopLevelQueryCompositeFilterPartTwo<
	T extends MetaType,
	AllQQCs extends readonly QueryAllConstraints[],
	AlreadyExist extends boolean = false
> = AllQQCs extends [infer Head, ...infer Rest extends QueryAllConstraints[]]
	? Head extends QueryCompositeFilterConstraint<
			'and' | 'or',
			QueryFilterConstraints[]
	  >
		? AlreadyExist extends false
			? ValidateTopLevelQueryCompositeFilterPartTwo<T, Rest, true>
			: ErrorInvalidTopLevelFilter
		: ValidateTopLevelQueryCompositeFilterPartTwo<T, Rest, AlreadyExist>
	: true // ok

export type FlattenQueryCompositeFilterConstraint<
	T extends MetaType,
	QQCs extends readonly QueryAllConstraints[],
	ACC extends QueryConstraints[] = []
> = QQCs extends [infer Head, ...infer Rest extends QueryAllConstraints[]]
	? FlattenQueryCompositeFilterConstraint<
			T,
			Rest,
			Head extends QueryConstraints
				? [...ACC, Head]
				: Head extends QueryCompositeFilterConstraint<
						'and' | 'or',
						QueryFilterConstraints[]
				  >
				? [
						...ACC,
						...FlattenQueryCompositeFilterConstraint<
							T,
							Head['constraints'],
							ACC
						>
				  ]
				: ACC
	  >
	: ACC

export type QueryFilterConstraintLimitation<
	T extends MetaType,
	Q extends GeneralQuery<T>,
	RestQQCs extends readonly QueryAllConstraints[],
	PreviousQCs extends readonly QueryConstraints[],
	ParentConstraint extends QueryCompositeFilterConstraint<
		'and' | 'or',
		QueryFilterConstraints[]
	>
> = RestQQCs extends [
	infer Head extends
		| QueryConstraints
		| QueryCompositeFilterConstraint<'and' | 'or', QueryFilterConstraints[]>,
	...infer Rest extends QueryAllConstraints[]
]
	? [
			Head extends
				| LimitConstraint<'limit' | 'limitToLast'>
				| OrderByConstraint<string>
				| CursorConstraint<CursorType, unknown[]>
				? ErrorOrAndInvalidConstraints
				: Head extends WhereConstraint<string, WhereFilterOp, unknown>
				? Head['opStr'] extends NotIn
					? 'or' extends ParentConstraint['type']
						? ParentConstraint['constraints']['length'] extends 1
							? WhereConstraintLimitation<T, Q, Head, PreviousQCs>
							: ErrorCannotUseNotInOrQuery
						: WhereConstraintLimitation<T, Q, Head, PreviousQCs>
					: WhereConstraintLimitation<T, Q, Head, PreviousQCs>
				: Head extends QueryCompositeFilterConstraint<
						'and' | 'or',
						QueryFilterConstraints[]
				  >
				? QueryCompositeFilterConstraint<
						Head['type'],
						QueryFilterConstraintLimitation<
							T,
							Q,
							Head['constraints'],
							PreviousQCs,
							Head
						>
				  >
				: never, // impossible route
			...QueryFilterConstraintLimitation<
				T,
				Q,
				Rest,
				[...PreviousQCs, ...FlattenQueryCompositeFilterConstraint<T, [Head]>],
				ParentConstraint
			>
	  ]
	: RestQQCs // indicate RestQQCs is []
