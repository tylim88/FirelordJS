import { MetaType } from './metaTypeCreator'
import { QueryConstraints } from './queryConstraints'
import {
	AddSentinelFieldPathToCompare,
	AddSentinelFieldPathToCompareHighLevel,
} from './fieldPath'
import { QueryConstraintLimitation } from './queryConstraintLimitation'
import { IsEqual } from './utils'
import { Query, CollectionReference } from './refs'

export type QueryRef = <
	T extends MetaType,
	Q extends Query<T>,
	QC extends QueryConstraints<AddSentinelFieldPathToCompare<T>>[]
>(
	query: Q extends never
		? Q
		: IsEqual<Q, Query<T>> extends true
		? Query<T>
		: IsEqual<Q, CollectionReference<T>> extends true
		? CollectionReference<T>
		: never, // has to code this way to infer T perfectly
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
