import { MetaType } from './metaTypeCreator'
import { ErrorMoreThanOnceDocSnapshotInCursor } from './error'
import { IsUnion } from './utils'
import { CursorConstraint } from './queryConstraints'
import { DocumentSnapshot } from './snapshot'

export type CursorType = 'startAt' | 'startAfter' | 'endAt' | 'endBefore'

export type Cursor<Type extends CursorType> = <Values extends unknown[]>(
	...snapshotOrFieldValues: Values extends (infer R)[]
		? DocumentSnapshot<MetaType> extends R
			? IsUnion<R> extends false
				? Values extends [infer Head, ...infer Rest]
					? Rest extends []
						? Values
						: ErrorMoreThanOnceDocSnapshotInCursor
					: never[]
				: ErrorMoreThanOnceDocSnapshotInCursor
			: Values
		: Values
) => CursorConstraint<Type, Values>
