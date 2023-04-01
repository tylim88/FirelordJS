import { MetaType } from '../metaTypeCreator'
import { WhereFilterOp, OrderByDirection } from '../alias'
import {
	QueryConstraints,
	WhereConstraint,
	OrderByConstraint,
	CursorConstraint,
	LimitConstraint,
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
import { ValidateTopLevelQueryCompositeFilter } from './queryFilter'

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
> = ValidateTopLevelQueryCompositeFilter<
	T,
	AllQCs
> extends infer B extends string
	? B[]
	: ValidateOrderByAndInequalityWhere<T, AllQCs> extends infer K extends string
	? K[]
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
					Head extends QueryConstraints<T> ? [...PreviousQCs, Head] : never, // impossible route
					AllQCs
				>
		  ]
		: never[] // impossible route
	: RestQCs // basically mean RestQCs is []
