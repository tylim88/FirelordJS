import { MetaType } from '../metaTypeCreator'
import { QueryConstraints } from '../queryConstraints'
import {
	AddSentinelFieldPathToCompare,
	AddSentinelFieldPathToCompareHighLevel,
} from '../fieldPath'
import { QueryConstraintLimitation } from '../queryConstraintLimitation/query'
import { Query, CollectionReference } from '../refs'

export type Or<T extends MetaType> = <
	Q extends Query<T> | CollectionReference<T>,
	QC extends QueryConstraints<AddSentinelFieldPathToCompare<T>>[]
>(
	...queryConstraints: QC extends never
		? QC
		: QueryConstraintLimitation<
				AddSentinelFieldPathToCompare<T>,
				AddSentinelFieldPathToCompareHighLevel<T, Q>,
				QC,
				[],
				QC
		  >
) => OrQueryCompositeFilterConstraint<T>

export type OrQueryCompositeFilterConstraint<T extends MetaType> = {
	type: 'or'
	do_not_access?: T
}
