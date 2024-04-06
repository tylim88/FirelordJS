import { MetaType } from '../metaTypeCreator'
import { ErrorCursorTooManyArguments } from '../error'
import {
	QueryConstraints,
	OrderByConstraint,
	CursorConstraint,
	CursorType,
} from '../queryConstraints'
import { __name__, GetCorrectDocumentIdBasedOnRef } from '../fieldPath'
import { QueryDocumentSnapshot, DocumentSnapshot } from '../snapshot'
import { GetAllOrderBy } from './orderBy'
import { GeneralQuery } from '../refs'
import { DeepValue } from '../objectFlatten'

// Too many arguments provided to startAt(). The number of arguments must be less than or equal to the number of orderBy() clauses
type ValidateCursorOrderBy<
	T extends MetaType,
	Q extends GeneralQuery<T>,
	Values extends unknown[],
	AllOrderBy extends OrderByConstraint<string>[]
> = Values extends [infer Head, ...infer Rest]
	? AllOrderBy extends [infer H, ...infer R]
		? H extends OrderByConstraint<string>
			? [
					H['fieldPath'] extends __name__
						? GetCorrectDocumentIdBasedOnRef<T, Q, H['fieldPath'], Head>
						: Head extends
								| DeepValue<T['compare'], H['fieldPath']>
								| QueryDocumentSnapshot<T>
								| DocumentSnapshot<T>
						? Head | QueryDocumentSnapshot<T> | DocumentSnapshot<T>
						:
								| DeepValue<T['compare'], H['fieldPath']>
								| QueryDocumentSnapshot<T>
								| DocumentSnapshot<T>,
					...ValidateCursorOrderBy<
						T,
						Q,
						Rest,
						R extends OrderByConstraint<string>[] ? R : []
					>
			  ]
			: never // impossible route
		: [ErrorCursorTooManyArguments]
	: [] // end, Rest is []

export type CursorConstraintLimitation<
	T extends MetaType,
	Q extends GeneralQuery<T>,
	U extends CursorConstraint<CursorType, unknown[]>,
	PreviousQCs extends readonly QueryConstraints[]
> = CursorConstraint<
	CursorType,
	ValidateCursorOrderBy<T, Q, U['values'], GetAllOrderBy<T, PreviousQCs, []>>
>
