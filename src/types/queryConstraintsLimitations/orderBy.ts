import { MetaType } from '../metaTypeCreator'
import { QueryConstraints, OrderByConstraint } from '../queryConstraints'

export type GetFirstOrderBy<
	T extends MetaType,
	QCs extends readonly QueryConstraints<T>[]
> = QCs extends [infer H, ...infer Rest]
	? H extends OrderByConstraint<string>
		? H
		: Rest extends readonly QueryConstraints<T>[]
		? GetFirstOrderBy<T, Rest>
		: never // impossible route
	: true // not found, no check needed

export type GetAllOrderBy<
	T extends MetaType,
	QCs extends readonly QueryConstraints<T>[],
	AllOrderBy extends OrderByConstraint<string>[]
> = QCs extends [infer H, ...infer Rest]
	? Rest extends readonly QueryConstraints<T>[]
		? GetAllOrderBy<
				T,
				Rest,
				H extends OrderByConstraint<string> ? [...AllOrderBy, H] : AllOrderBy
		  >
		: [] // impossible route
	: AllOrderBy // not found, no check needed
