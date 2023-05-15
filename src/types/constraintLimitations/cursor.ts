import { MetaType } from '../metaTypeCreator'
import { OrderByDirection } from '../alias'
import { ErrorCursorTooManyArguments } from '../error'
import {
	QueryConstraints,
	OrderByConstraint,
	CursorConstraint,
} from '../constraints'
import { __name__, GetCorrectDocumentIdBasedOnRef } from '../fieldPath'
import { CursorType } from '../cursor'
import { QueryDocumentSnapshot, DocumentSnapshot } from '../snapshot'
import { GetAllOrderBy } from './orderBy'
import { Query } from '../refs'
import { DeepValue } from '../objectFlatten'

// Too many arguments provided to startAt(). The number of arguments must be less than or equal to the number of orderBy() clauses
type ValidateCursorOrderBy<
	T extends MetaType,
	Q extends Query<T>,
	Values extends unknown[],
	AllOrderBy extends OrderByConstraint<string, OrderByDirection | undefined>[]
> = Values extends [infer Head, ...infer Rest]
	? AllOrderBy extends [infer H, ...infer R]
		? H extends OrderByConstraint<string, OrderByDirection | undefined>
			? [
					H['_field'] extends __name__
						? GetCorrectDocumentIdBasedOnRef<T, Q, H['_field'], Head>
						: Head extends
								| DeepValue<T['compare'], H['_field']>
								| QueryDocumentSnapshot<T>
								| DocumentSnapshot<T>
						? Head | QueryDocumentSnapshot<T> | DocumentSnapshot<T>
						:
								| DeepValue<T['compare'], H['_field']>
								| QueryDocumentSnapshot<T>
								| DocumentSnapshot<T>,
					...ValidateCursorOrderBy<
						T,
						Q,
						Rest,
						R extends OrderByConstraint<string, OrderByDirection | undefined>[]
							? R
							: []
					>
			  ]
			: never // impossible route
		: [ErrorCursorTooManyArguments]
	: [] // end, Rest is []

export type CursorConstraintLimitation<
	T extends MetaType,
	Q extends Query<T>,
	U extends CursorConstraint<CursorType, unknown[]>,
	PreviousQCs extends readonly QueryConstraints<T>[]
> = CursorConstraint<
	CursorType,
	ValidateCursorOrderBy<
		T,
		Q,
		U['_docOrFields'],
		GetAllOrderBy<T, PreviousQCs, []>
	>
>
