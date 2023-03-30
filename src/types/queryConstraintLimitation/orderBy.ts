import { MetaType } from '../metaTypeCreator'
import { OrderByDirection } from '../alias'
import { ErrorWhereOrderByEquality } from '../error'
import {
	QueryConstraints,
	WhereConstraint,
	OrderByConstraint,
} from '../queryConstraints'
import { GetAllWhereConstraint } from './where'
import { In, Equal } from './utils'

// You can't order your query by a field included in an equality (==) or (in) clause.
export type ValidateOrderByEqualityWhere<
	T extends MetaType,
	U extends OrderByConstraint<string, OrderByDirection | undefined>,
	AllQCs extends QueryConstraints<T>[]
> = Extract<
	GetAllWhereConstraint<T, AllQCs, never>,
	WhereConstraint<T, U['fieldPath'], In | Equal, unknown>
> extends never
	? true
	: false

export type OrderByConstraintLimitation<
	T extends MetaType,
	U extends OrderByConstraint<string, OrderByDirection | undefined>,
	AllQCs extends QueryConstraints<T>[]
> = ValidateOrderByEqualityWhere<T, U, AllQCs> extends false
	? ErrorWhereOrderByEquality
	: U

export type GetFirstOrderBy<
	T extends MetaType,
	QCs extends QueryConstraints<T>[]
> = QCs extends [infer H, ...infer Rest]
	? H extends OrderByConstraint<string, OrderByDirection | undefined>
		? H
		: Rest extends QueryConstraints<T>[]
		? GetFirstOrderBy<T, Rest>
		: never // impossible route
	: true // not found, no check needed

export type GetAllOrderBy<
	T extends MetaType,
	QCs extends QueryConstraints<T>[],
	AllOrderBy extends OrderByConstraint<string, OrderByDirection | undefined>[]
> = QCs extends [infer H, ...infer Rest]
	? Rest extends QueryConstraints<T>[]
		? GetAllOrderBy<
				T,
				Rest,
				H extends OrderByConstraint<string, OrderByDirection | undefined>
					? [...AllOrderBy, H]
					: AllOrderBy
		  >
		: [] // impossible route
	: AllOrderBy // not found, no check needed
