import { MetaType } from '../metaTypeCreator'
import { QueryFilterConstraints } from '../queryConstraints'
import { QueryFilterConstraintLimitation } from '../queryConstraintsLimitations'
import { GeneralQuery } from '../refs'
import { ErrorEmptyCompositeFilter } from '../error'
import { OriQueryCompositeFilterConstraint } from '../alias'

export type QueryCompositeFilterConstraint<
	Y extends 'and' | 'or',
	X extends QueryFilterConstraints[]
> = {
	type: Y
	constraints: X
	ref: OriQueryCompositeFilterConstraint
}

type QueryCompositeFilter<T extends MetaType, Type extends 'and' | 'or'> = <
	Q extends GeneralQuery<T>,
	QFCs extends QueryFilterConstraints[]
>(
	...queryFilterConstraints: QFCs extends never
		? QFCs
		: QFCs extends never[]
		? [ErrorEmptyCompositeFilter]
		: QueryFilterConstraintLimitation<
				T,
				Q,
				QFCs,
				[],
				QueryCompositeFilterConstraint<Type, QFCs>
		  >
) => QueryCompositeFilterConstraint<Type, QFCs>

/**
 * Creates a new {@link QueryCompositeFilterConstraint} that is a conjunction of
 * the given filter constraints. A conjunction filter includes a document if it
 * satisfies all of the given filters.
 *
 * @param queryConstraints - Optional. The list of
 * {@link QueryFilterConstraint}s to perform a conjunction for. These must be
 * created with calls to {@link where}, {@link or}, or {@link and}.
 * @returns The newly created {@link QueryCompositeFilterConstraint}.
 */
export type And<T extends MetaType> = QueryCompositeFilter<T, 'and'>
export type AndCreator = <T extends MetaType>() => And<T>

/**
 * Creates a new {@link QueryCompositeFilterConstraint} that is a disjunction of
 * the given filter constraints. A disjunction filter includes a document if it
 * satisfies any of the given filters.
 *
 * @param queryConstraints - Optional. The list of
 * {@link QueryFilterConstraint}s to perform a disjunction for. These must be
 * created with calls to {@link where}, {@link or}, or {@link and}.
 * @returns The newly created {@link QueryCompositeFilterConstraint}.
 */
export type Or<T extends MetaType> = QueryCompositeFilter<T, 'or'>
export type OrCreator = <T extends MetaType>() => Or<T>
