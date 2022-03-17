import { MetaTypes } from './creator'
import { ErrorMoreThanOnceDocSnapshotInCursor } from './error'
import { IsUnion } from './utils'
import { CursorConstraint } from './queryConstraints'
import { DocumentSnapshot } from './snapshot'

export type Cursor = <T extends unknown[]>(
	...snapshotOrFieldValues: T extends (infer R)[]
		? DocumentSnapshot<MetaTypes> extends R
			? IsUnion<R> extends false
				? T extends [infer Head, ...infer Rest]
					? Rest extends []
						? T
						: ErrorMoreThanOnceDocSnapshotInCursor
					: never[]
				: ErrorMoreThanOnceDocSnapshotInCursor
			: T
		: T
) => CursorConstraint<T>
