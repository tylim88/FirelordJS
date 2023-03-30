import { MetaType } from './metaTypeCreator'
import { QueryConstraints } from './queryConstraints'
import {
	AddSentinelFieldPathToCompare,
	AddSentinelFieldPathToCompareHighLevel,
} from './fieldPath'
import { QueryConstraintLimitation } from './queryConstraintLimitation/query'
import { Query, CollectionReference } from './refs'
// import { Or, OrQueryCompositeFilterConstraint } from './or'
// import { And } from './and'

export type QueryRef = {
	<
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
	): Query<T>
	// <
	// 	T extends MetaType,
	// 	Q extends Query<T>,
	// 	QC extends OrQueryCompositeFilterConstraint<T, Q>
	// >(
	// 	query: Q extends never
	// 		? Q
	// 		: IsEqual<Q, Query<T>> extends true
	// 		? Query<T>
	// 		: IsEqual<Q, CollectionReference<T>> extends true
	// 		? CollectionReference<T>
	// 		: never, // has to code this way to infer T perfectly
	// 	queryCompositeFilterConstraint: QC extends never
	// 		? QC
	// 		: OrQueryCompositeFilterConstraint<T, Q>
	// ): Query<T>
}
