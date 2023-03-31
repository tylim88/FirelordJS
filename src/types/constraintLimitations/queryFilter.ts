import { MetaType } from '../metaTypeCreator'
import { WhereFilterOp, OrderByDirection } from '../alias'
import {
	WhereConstraint,
	OrderByConstraint,
	CursorConstraint,
	LimitConstraint,
	QueryFilterConstraints,
	QueryCompositeFilterConstraint,
} from '../constraints'
import { Query } from '../refs'
import { CursorType } from '../cursor'
import { WhereConstraintLimitation } from './where'
import { ErrorOrAndInvalidConstraints } from '../error'
import { StrictExclude } from '../utils'

export type QueryFilterConstraintLimitation<
	T extends MetaType,
	Q extends Query<T>,
	RestQFCs extends QueryFilterConstraints<T>[],
	PreviousQFCs extends QueryFilterConstraints<T>[],
	AllQFCs extends QueryFilterConstraints<T>[]
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
							PreviousQFCs,
							AllQFCs
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
					],
					AllQFCs
				>
		  ]
		: never[] // impossible route
	: RestQFCs // basically mean RestQFCs is []
