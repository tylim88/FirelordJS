import { MetaType } from '../metaTypeCreator'
import { WhereFilterOp, OrderByDirection } from '../alias'
import {
	WhereConstraint,
	OrderByConstraint,
	CursorConstraint,
	LimitConstraint,
	QueryFilterConstraints,
	QueryCompositeFilterConstraint,
	QueryConstraints,
	QQC,
} from '../constraints'
import { Query } from '../refs'
import { CursorType } from '../cursor'
import { WhereConstraintLimitation } from './where'
import {
	ErrorOrAndInvalidConstraints,
	ErrorInvalidTopLevelFilter,
	ErrorCannotUseNotInOrQuery,
} from '../error'
import { StrictExclude } from '../utils'

type GetAllQueryFilterCompositeConstraint<
	T extends MetaType,
	QQCs extends readonly QQC<T>[],
	QueryCompositeConstraintAcc extends QueryCompositeFilterConstraint<
		T,
		'and' | 'or',
		QueryFilterConstraints<T>[]
	>
> = QQCs extends [infer H, ...infer R extends QQC<T>[]]
	?
			| QueryCompositeConstraintAcc
			| GetAllQueryFilterCompositeConstraint<
					T,
					R,
					| (H extends QueryCompositeFilterConstraint<
							T,
							'and' | 'or',
							QueryFilterConstraints<T>[]
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
	AllQQCs extends readonly QQC<T>[]
> = AllQQCs extends (infer P)[]
	? Extract<P, WhereConstraint<T, string, WhereFilterOp, unknown>> extends never
		? true
		: GetAllQueryFilterCompositeConstraint<T, AllQQCs, never> extends never
		? true
		: ErrorInvalidTopLevelFilter
	: never

// `Error: When using composite filters, you cannot use more than one filter('and' 'when' 'or') at the top level. Consider nesting the multiple filters within an 'and(...)' statement. For example: change 'query(query, where(...), or(...))' to 'query(query, and(where(...), or(...)))'.`
// check or/and + or/and
export type ValidateTopLevelQueryCompositeFilterPartTwo<
	T extends MetaType,
	AllQQCs extends readonly QQC<T>[],
	AlreadyExist extends boolean = false
> = AllQQCs extends [infer Head, ...infer Rest extends QQC<T>[]]
	? Head extends QueryCompositeFilterConstraint<
			T,
			'and' | 'or',
			QueryFilterConstraints<T>[]
	  >
		? AlreadyExist extends false
			? ValidateTopLevelQueryCompositeFilterPartTwo<T, Rest, true>
			: ErrorInvalidTopLevelFilter
		: ValidateTopLevelQueryCompositeFilterPartTwo<T, Rest, AlreadyExist>
	: true // ok

export type FlattenQueryCompositeFilterConstraint<
	T extends MetaType,
	QQCs extends readonly QQC<T>[],
	ACC extends QueryConstraints<T>[] = []
> = QQCs extends [infer Head, ...infer Rest extends QQC<T>[]]
	? FlattenQueryCompositeFilterConstraint<
			T,
			Rest,
			Head extends QueryConstraints<T>
				? [...ACC, Head]
				: Head extends QueryCompositeFilterConstraint<
						T,
						'and' | 'or',
						QueryFilterConstraints<T>[]
				  >
				? [
						...ACC,
						...FlattenQueryCompositeFilterConstraint<
							T,
							StrictExclude<
								Head['do_not_access.query_filter_constraint'],
								undefined
							>,
							ACC
						>
				  ]
				: ACC
	  >
	: ACC

export type QueryFilterConstraintLimitation<
	T extends MetaType,
	Q extends Query<T>,
	RestQQCs extends readonly QQC<T>[],
	PreviousQCs extends readonly QueryConstraints<T>[],
	ParentConstraint extends QueryCompositeFilterConstraint<
		T,
		'and' | 'or',
		QueryFilterConstraints<T>[]
	>
> = RestQQCs extends [
	infer Head extends
		| QueryConstraints<T>
		| QueryCompositeFilterConstraint<
				T,
				'and' | 'or',
				QueryFilterConstraints<T>[]
		  >,
	...infer Rest extends QQC<T>[]
]
	? [
			Head extends
				| LimitConstraint<'limit' | 'limitToLast', number>
				| OrderByConstraint<string, OrderByDirection | undefined>
				| CursorConstraint<CursorType, unknown[]>
				? ErrorOrAndInvalidConstraints
				: Head extends WhereConstraint<
						T,
						string,
						StrictExclude<WhereFilterOp, 'not-in'>,
						unknown
				  >
				? WhereConstraintLimitation<T, Q, Head, PreviousQCs>
				: Head extends QueryCompositeFilterConstraint<
						T,
						'and' | 'or',
						QueryFilterConstraints<T>[]
				  >
				? QueryCompositeFilterConstraint<
						T,
						Head['type'],
						QueryFilterConstraintLimitation<
							T,
							Q,
							StrictExclude<
								Head['do_not_access.query_filter_constraint'],
								undefined
							>,
							PreviousQCs,
							Head
						>
				  >
				: Head extends WhereConstraint<T, string, 'not-in', unknown>
				? ParentConstraint['type'] extends 'or'
					? ErrorCannotUseNotInOrQuery
					: Head
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
