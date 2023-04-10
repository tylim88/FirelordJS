import { MetaType } from '../metaTypeCreator'
import { WhereFilterOp, OrderByDirection } from '../alias'
import {
	QueryConstraints,
	WhereConstraint,
	OrderByConstraint,
	CursorConstraint,
	LimitConstraint,
	QueryAllConstraints,
	QueryCompositeFilterConstraint,
	QueryFilterConstraints,
} from '../constraints'
import { Query } from '../refs'
import { CursorType } from '../cursor'
import { LimitToLastConstraintLimitation } from './limit'
import { CursorConstraintLimitation } from './cursor'
import { OrderByConstraintLimitation, GetFirstOrderBy } from './orderBy'
import { GetFirstInequalityWhere, WhereConstraintLimitation } from './where'
import { InequalityOpStr } from './utils'
import { IsSame } from '../utils'
import { ErrorWhereOrderByAndInEquality } from '../error'
import {
	FlattenQueryCompositeFilterConstraint,
	QueryFilterConstraintLimitation,
} from './queryFilter'

// If you include a filter with a range comparison (<, <=, >, >=), your first ordering must be on the same field
export type ValidateOrderByAndInequalityWhere<
	T extends MetaType,
	AllQCs extends readonly QueryConstraints<T>[]
> = GetFirstInequalityWhere<T, AllQCs> extends infer W extends WhereConstraint<
	T,
	string,
	InequalityOpStr,
	unknown
>
	? GetFirstOrderBy<T, AllQCs> extends infer O
		? O extends OrderByConstraint<string, OrderByDirection | undefined>
			? IsSame<W['_field'], O['_field']> extends true
				? true
				: ErrorWhereOrderByAndInEquality<O['_field'], W['_field']>
			: true // orderBy not found
		: true // inequality Where not found
	: true // impossible route

export type QueryConstraintLimitation<
	T extends MetaType,
	Q extends Query<T>,
	RestQQCs extends readonly QueryAllConstraints<T>[],
	PreviousQCs extends readonly QueryConstraints<T>[],
	AllQCs extends readonly QueryConstraints<T>[]
> = RestQQCs extends [
	infer Head extends QueryAllConstraints<T>,
	...infer Rest extends QueryAllConstraints<T>[]
]
	? [
			Head extends LimitConstraint<'limit', number>
				? Head
				: Head extends OrderByConstraint<string, OrderByDirection | undefined>
				? ValidateOrderByAndInequalityWhere<
						// we can factor out this part but got a bit problem so I left it here
						T,
						AllQCs
				  > extends infer K extends string
					? K[]
					: OrderByConstraintLimitation<T, Head, AllQCs>
				: Head extends LimitConstraint<'limitToLast', number>
				? LimitToLastConstraintLimitation<T, Head, AllQCs>
				: Head extends WhereConstraint<T, string, WhereFilterOp, unknown>
				? WhereConstraintLimitation<T, Q, Head, PreviousQCs>
				: Head extends CursorConstraint<CursorType, unknown[]>
				? CursorConstraintLimitation<T, Head, PreviousQCs>
				: Head extends QueryCompositeFilterConstraint<
						T,
						'and' | 'or',
						QueryFilterConstraints<T>[]
				  >
				? QueryFilterConstraintLimitation<
						T,
						Q,
						[Head],
						PreviousQCs,
						Head
				  > extends [infer P]
					? P
					: never // impossible route
				: never, // impossible route
			...QueryConstraintLimitation<
				T,
				Q,
				Rest,
				[...PreviousQCs, ...FlattenQueryCompositeFilterConstraint<T, [Head]>],
				AllQCs
			>
	  ]
	: RestQQCs // indicate RestQCs is []
