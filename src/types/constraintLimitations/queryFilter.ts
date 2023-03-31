import { MetaType } from '../metaTypeCreator'
import { WhereFilterOp, OrderByDirection } from '../alias'
import {
	WhereConstraint,
	OrderByConstraint,
	CursorConstraint,
	LimitConstraint,
	QueryFilterConstraints,
} from '../constraints'
import { Query } from '../refs'
import { CursorType } from '../cursor'
import { WhereConstraintLimitation } from './where'
import { ErrorOrAndInvalidConstraints } from '../error'

export type QueryFilterConstraintLimitation<
	T extends MetaType,
	Q extends Query<T>,
	RestQFCs extends QueryFilterConstraints<T>[],
	PreviousQFCs extends QueryFilterConstraints<T>[],
	AllQFCs extends QueryFilterConstraints<T>[]
> = RestQFCs extends [infer Head, ...infer Rest]
	? Rest extends QueryFilterConstraints<T>[]
		? [
				Head extends
					| LimitConstraint<'limit' | 'limitToLast', number>
					| OrderByConstraint<string, OrderByDirection | undefined>
					| CursorConstraint<CursorType, unknown[]>
					? ErrorOrAndInvalidConstraints
					: Head extends WhereConstraint<T, string, WhereFilterOp, unknown>
					? WhereConstraintLimitation<T, Q, Head, PreviousQFCs>
					: never, // impossible route
				...QueryFilterConstraintLimitation<
					T,
					Q,
					Rest,
					Head extends QueryFilterConstraints<T>
						? [...PreviousQFCs, Head]
						: PreviousQFCs, // impossible route
					AllQFCs
				>
		  ]
		: never[] // impossible route
	: RestQFCs // basically mean RestQFCs is []
