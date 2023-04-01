import { MetaType } from '../metaTypeCreator'
import { QueryConstraints, QQC } from '../constraints'
import {
	AddSentinelFieldPathToCompare,
	AddSentinelFieldPathToCompareHighLevel,
} from '../fieldPath'
import { QueryConstraintLimitation } from '../constraintLimitations'
import { Query, CollectionReference } from '../refs'

export type QueryRef = <
	T extends MetaType,
	Q extends Query<T> | CollectionReference<T>,
	QC extends QueryConstraints<AddSentinelFieldPathToCompare<T>>[]
>(
	query: Q extends never ? Q : Query<T> | CollectionReference<T>,
	...queryConstraints: QC extends never
		? QC
		: QueryConstraintLimitation<
				AddSentinelFieldPathToCompare<T>,
				AddSentinelFieldPathToCompareHighLevel<T, Q>,
				QC,
				[],
				QC
		  >
) => Query<T>
