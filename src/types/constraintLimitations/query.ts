import { MetaType } from '../metaTypeCreator'
import { WhereFilterOp, OrderByDirection } from '../alias'
import {
	QueryConstraints,
	WhereConstraint,
	OrderByConstraint,
	CursorConstraint,
	LimitConstraint,
	QQC,
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
	ValidateTopLevelQueryCompositeFilter,
	FlattenQueryCompositeFilterConstraint,
	QueryFilterConstraintLimitation,
} from './queryFilter'

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
	RestQQCs extends readonly QQC<T>[],
	PreviousQCs extends readonly QueryConstraints<T>[],
	AllQQCs extends readonly QQC<T>[]
> = FlattenQueryCompositeFilterConstraint<
	T,
	AllQQCs
> extends infer AllQCs extends QueryConstraints<T>[]
	? ValidateTopLevelQueryCompositeFilter<
			T,
			AllQQCs
	  > extends infer B extends string
		? B[]
		: ValidateOrderByAndInequalityWhere<
				T,
				AllQCs
		  > extends infer K extends string
		? K[]
		: RestQQCs extends [
				infer Head extends QQC<T>,
				...infer Rest extends QQC<T>[]
		  ]
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
					: Head extends QueryCompositeFilterConstraint<
							T,
							'and' | 'or',
							QueryFilterConstraints<T>[]
					  >
					? QueryFilterConstraintLimitation<T, Q, Rest, PreviousQCs>
					: never, // impossible route
				...QueryConstraintLimitation<
					T,
					Q,
					Rest,
					[...PreviousQCs, ...FlattenQueryCompositeFilterConstraint<T, [Head]>], // impossible route
					AllQCs
				>
		  ]
		: RestQQCs // basically mean RestQCs is []
	: never // impossible route
