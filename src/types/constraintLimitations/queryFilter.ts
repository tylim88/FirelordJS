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
import { WhereConstraintLimitation } from './where'
import { ErrorOrAndInvalidConstraints } from '../error'
import { StrictExclude } from '../utils'

export type GetAllQueryFilterCompositeConstraint<
	T extends MetaType,
	QCs extends (QueryConstraints<T> | QueryFilterConstraints<T>)[],
	QueryCompositeConstraintAcc extends QueryCompositeFilterConstraint<
		T,
		'and' | 'or'
	>
> = QCs extends [infer H, ...infer R]
	? R extends (QueryConstraints<T> | QueryFilterConstraints<T>)[]
		?
				| QueryCompositeConstraintAcc
				| GetAllQueryFilterCompositeConstraint<
						T,
						R,
						| (H extends QueryCompositeFilterConstraint<T, 'and' | 'or'>
								? H
								: never)
						| QueryCompositeConstraintAcc
				  >
		: QueryCompositeConstraintAcc // R is []
	: QueryCompositeConstraintAcc // QCs is []

export type QueryFilterConstraintLimitation<
	T extends MetaType,
	Q extends Query<T>,
	RestQFCs extends QueryFilterConstraints<T>[],
	PreviousQFCs extends QueryFilterConstraints<T>[]
> = RestQFCs extends [infer Head, ...infer Rest]
	? Rest extends QueryFilterConstraints<T>[]
		? [
				...(Head extends
					| LimitConstraint<'limit' | 'limitToLast', number>
					| OrderByConstraint<string, OrderByDirection | undefined>
					| CursorConstraint<CursorType, unknown[]>
					? [ErrorOrAndInvalidConstraints]
					: Head extends WhereConstraint<T, string, WhereFilterOp, unknown>
					? [WhereConstraintLimitation<T, Q, Head, PreviousQFCs>]
					: Head extends QueryCompositeFilterConstraint<T, 'and' | 'or'>
					? QueryFilterConstraintLimitation<
							T,
							Q,
							StrictExclude<
								Head['do_not_access.query_filter_constraint'],
								undefined
							>,
							PreviousQFCs
					  >
					: never), // impossible route
				...QueryFilterConstraintLimitation<
					T,
					Q,
					Rest,
					[
						...PreviousQFCs,
						...(Head extends WhereConstraint<T, string, WhereFilterOp, unknown>
							? [Head]
							: Head extends QueryCompositeFilterConstraint<T, 'and' | 'or'>
							? StrictExclude<
									Head['do_not_access.query_filter_constraint'],
									undefined
							  >
							: PreviousQFCs) // impossible route
					]
				>
		  ]
		: never[] // impossible route
	: RestQFCs // basically mean RestQFCs is []
