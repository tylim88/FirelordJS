import { MetaType } from '../metaTypeCreator'
import { OrderByDirection } from '../alias'
import { ErrorCursorTooManyArguments, ErrorCursor__name__ } from '../error'
import {
	QueryConstraints,
	OrderByConstraint,
	CursorConstraint,
} from '../queryConstraints'
import { RemoveSentinelFieldPathFromCompare, __name__ } from '../fieldPath'
import { CursorType } from '../cursor'
import { QueryDocumentSnapshot, DocumentSnapshot } from '../snapshot'
import { GetAllOrderBy } from './orderBy'

// Too many arguments provided to startAt(). The number of arguments must be less than or equal to the number of orderBy() clauses
type ValidateCursorOrderBy<
	T extends MetaType,
	Values extends unknown[],
	AllOrderBy extends OrderByConstraint<string, OrderByDirection | undefined>[]
> = Values extends [infer Head, ...infer Rest]
	? AllOrderBy extends [infer H, ...infer R]
		? H extends OrderByConstraint<string, OrderByDirection | undefined>
			? [
					H['fieldPath'] extends __name__
						? string extends Head
							? ErrorCursor__name__
							: T['docPath']
						: Head extends
								| T['compare'][H['fieldPath']]
								| QueryDocumentSnapshot<T>
								| DocumentSnapshot<T>
						? Head | QueryDocumentSnapshot<T> | DocumentSnapshot<T>
						:
								| T['compare'][H['fieldPath']]
								| QueryDocumentSnapshot<T>
								| DocumentSnapshot<T>,
					...ValidateCursorOrderBy<
						T,
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
	U extends CursorConstraint<CursorType, unknown[]>,
	PreviousQCs extends QueryConstraints<T>[]
> = CursorConstraint<
	CursorType,
	ValidateCursorOrderBy<
		RemoveSentinelFieldPathFromCompare<T>,
		U['values'],
		GetAllOrderBy<T, PreviousQCs, []>
	>
>
