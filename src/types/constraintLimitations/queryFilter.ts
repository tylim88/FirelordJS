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
} from '../constraints'
import { Query } from '../refs'
import { CursorType } from '../cursor'
import { WhereConstraintLimitation, GetAllWhereConstraint } from './where'
import {
	ErrorOrAndInvalidConstraints,
	ErrorInvalidTopLevelFilter,
} from '../error'
import { StrictExclude } from '../utils'

type GetAllQueryFilterCompositeConstraint<
	T extends MetaType,
	QQCs extends (QueryConstraints<T> | QueryFilterConstraints<T>)[],
	QueryCompositeConstraintAcc extends QueryCompositeFilterConstraint<
		T,
		'and' | 'or',
		QueryFilterConstraints<T>[]
	>
> = QQCs extends [
	infer H,
	...infer R extends (QueryConstraints<T> | QueryFilterConstraints<T>)[]
]
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

export type ValidateTopLevelQueryCompositeFilter<
	T extends MetaType,
	AllQQCs extends (QueryConstraints<T> | QueryFilterConstraints<T>)[]
> = GetAllWhereConstraint<
	T,
	FlattenQueryCompositeFilterConstraint<T, AllQQCs>,
	never
> extends never
	? never
	: GetAllQueryFilterCompositeConstraint<T, AllQQCs, never> extends never
	? never
	: ErrorInvalidTopLevelFilter

export type FlattenQueryCompositeFilterConstraint<
	T extends MetaType,
	QQCs extends (QueryConstraints<T> | QueryFilterConstraints<T>)[],
	ACC extends WhereConstraint<T, string, WhereFilterOp, unknown>[] = []
> = QQCs extends [
	infer Head,
	...infer Rest extends (QueryConstraints<T> | QueryFilterConstraints<T>)[]
]
	? FlattenQueryCompositeFilterConstraint<
			T,
			Rest,
			Head extends WhereConstraint<T, string, WhereFilterOp, unknown>
				? [...ACC, Head]
				: Head extends QueryCompositeFilterConstraint<
						T,
						'and' | 'or',
						QueryFilterConstraints<T>[]
				  >
				? [
						...ACC,
						FlattenQueryCompositeFilterConstraint<
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
	: never // impossible route

export type QueryFilterConstraintLimitation<
	T extends MetaType,
	Q extends Query<T>,
	RestQQCs extends (QueryConstraints<T> | QueryFilterConstraints<T>)[],
	PreviousQCs extends QueryConstraints<T>[]
> = RestQQCs extends [
	infer Head extends QueryConstraints<T> | QueryFilterConstraints<T>,
	...infer Rest extends (QueryConstraints<T> | QueryFilterConstraints<T>)[]
]
	? [
			Head extends
				| LimitConstraint<'limit' | 'limitToLast', number>
				| OrderByConstraint<string, OrderByDirection | undefined>
				| CursorConstraint<CursorType, unknown[]>
				? ErrorOrAndInvalidConstraints
				: Head extends WhereConstraint<T, string, WhereFilterOp, unknown>
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
							PreviousQCs
						>
				  >
				: never, // impossible route
			...QueryFilterConstraintLimitation<
				T,
				Q,
				Rest,
				FlattenQueryCompositeFilterConstraint<T, [...PreviousQCs, Head]>
			>
	  ]
	: RestQQCs // basically mean RestQQCs is []
