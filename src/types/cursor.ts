import { MetaType } from './metaTypeCreator'
import { ErrorMoreThanOnceDocSnapshotInCursor, ErrorEmptyCursor } from './error'
import { CursorConstraint } from './queryConstraints'
import { DocumentSnapshot, QueryDocumentSnapshot } from './snapshot'

export type CursorType = 'startAt' | 'startAfter' | 'endAt' | 'endBefore'

export type Cursor<Type extends CursorType> = <Values extends unknown[]>(
	...snapshotOrFieldValues: Values['length'] extends 0
		? [ErrorEmptyCursor]
		: number extends Values['length']
		? [ErrorEmptyCursor]
		: Values extends (infer R)[]
		? DocumentSnapshot<MetaType> extends R // ! why R extends DocumentSnapshot<MetaType> mess up date type?
			? Values['length'] extends 1
				? Values
				: ErrorMoreThanOnceDocSnapshotInCursor[] // ! if this change to [ErrorMoreThanOnceDocSnapshotInCursor], it will not able to infer as literal type, why?
			: // eslint-disable-next-line @typescript-eslint/no-explicit-any
			QueryDocumentSnapshot<any> extends R // ! why QueryDocumentSnapshot<User> cannot extends QueryDocumentSnapshot<MetaType>?
			? Values['length'] extends 1
				? Values
				: ErrorMoreThanOnceDocSnapshotInCursor[]
			: Values
		: Values
) => CursorConstraint<Type, Values>
