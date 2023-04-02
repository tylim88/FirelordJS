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
import { WhereConstraintLimitation, GetAllWhereConstraint } from './where'
import {
	ErrorOrAndInvalidConstraints,
	ErrorInvalidTopLevelFilter,
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

export type ValidateTopLevelQueryCompositeFilter<
	T extends MetaType,
	AllQQCs extends readonly QQC<T>[]
> = GetAllWhereConstraint<
	T,
	FlattenQueryCompositeFilterConstraint<T, AllQQCs>,
	never
> extends never
	? true
	: GetAllQueryFilterCompositeConstraint<T, AllQQCs, never> extends never
	? true
	: ErrorInvalidTopLevelFilter

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
	PreviousQCs extends readonly QueryConstraints<T>[]
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
				[...PreviousQCs, ...FlattenQueryCompositeFilterConstraint<T, [Head]>]
			>
	  ]
	: RestQQCs // basically mean RestQQCs is []
