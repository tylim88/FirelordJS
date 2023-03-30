import { MetaType } from '../metaTypeCreator'
import { QueryConstraints } from '../queryConstraints'
import {
	AddSentinelFieldPathToCompare,
	AddSentinelFieldPathToCompareHighLevel,
} from '../fieldPath'
import { QueryConstraintLimitation } from '../queryConstraintLimitation/query'
import { Query, CollectionReference } from '../refs'
import { OrQueryCompositeFilterConstraint } from './or'
import { AndQueryCompositeFilterConstraint } from './and'

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
	<
		T extends MetaType,
		Q extends Query<T>,
		QC extends
			| OrQueryCompositeFilterConstraint<T>
			| AndQueryCompositeFilterConstraint<T>
	>(
		query: Q extends never ? Q : Query<T> | CollectionReference<T>,
		queryCompositeFilterConstraint: QC extends never
			? QC
			:
					| OrQueryCompositeFilterConstraint<T>
					| AndQueryCompositeFilterConstraint<T>
	): Query<T>
}
