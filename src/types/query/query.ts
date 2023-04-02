import { MetaType } from '../metaTypeCreator'
import { QQC } from '../constraints'
import {
	AddSentinelFieldPathToCompare,
	AddSentinelFieldPathToCompareHighLevel,
} from '../fieldPath'
import { QueryConstraintLimitation } from '../constraintLimitations'
import { Query, CollectionReference } from '../refs'

export type QueryRef = <
	T extends MetaType,
	Q extends Query<T> | CollectionReference<T>,
	const QQCs extends readonly QQC<AddSentinelFieldPathToCompare<T>>[]
>(
	query: Q extends never ? Q : Query<T> | CollectionReference<T>,
	...queryConstraints: QQCs extends never
		? QQCs
		: QueryConstraintLimitation<
				AddSentinelFieldPathToCompare<T>,
				AddSentinelFieldPathToCompareHighLevel<T, Q>,
				QQCs,
				[],
				QQCs
		  >
) => Query<T>
