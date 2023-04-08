import { MetaType } from '../metaTypeCreator'
import {
	QueryCompositeFilterConstraint,
	QueryFilterConstraints,
} from '../constraints'
import {
	AddSentinelFieldPathToCompare,
	AddSentinelFieldPathToCompareHighLevel,
} from '../fieldPath'
import { QueryFilterConstraintLimitation } from '../constraintLimitations'
import { Query, CollectionReference } from '../refs'

export type Or<T extends MetaType> = <
	Q extends Query<T> | CollectionReference<T>,
	QFC extends QueryFilterConstraints<AddSentinelFieldPathToCompare<T>>[]
>(
	...queryFilterConstraints: QFC extends never
		? QFC
		: QueryFilterConstraintLimitation<
				AddSentinelFieldPathToCompare<T>,
				AddSentinelFieldPathToCompareHighLevel<T, Q>,
				QFC,
				[],
				QueryCompositeFilterConstraint<T, 'or', QFC>
		  >
) => QueryCompositeFilterConstraint<T, 'or', QFC>
