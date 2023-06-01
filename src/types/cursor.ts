import { MetaType } from './metaTypeCreator'
import {
	ErrorMoreThanOnceDocSnapshotInCursor,
	ErrorEmptyCursor,
	ErrorCursorNoArray,
} from './error'
import { CursorConstraint } from './queryConstraints'
import { DocumentSnapshot, QueryDocumentSnapshot } from './snapshot'

export type CursorType = 'startAt' | 'startAfter' | 'endAt' | 'endBefore'

export type Cursor<Type extends CursorType> = <const Values extends unknown[]>(
	...snapshotOrFieldValues: Values['length'] extends 0
		? [ErrorEmptyCursor]
		: number extends Values['length']
		? [ErrorCursorNoArray]
		: Values extends (infer R)[]
		? DocumentSnapshot<MetaType> extends R // ! why R extends DocumentSnapshot<MetaType> mess up date type?
			? Values['length'] extends 1
				? Values
				: ErrorMoreThanOnceDocSnapshotInCursor[]
			: QueryDocumentSnapshot<MetaType> extends R
			? Values['length'] extends 1
				? Values
				: ErrorMoreThanOnceDocSnapshotInCursor[]
			: Values
		: Values
) => CursorConstraint<Type, Values>
