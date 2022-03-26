import { IsTrue } from './utils'
import { MetaType } from './metaTypeCreator'
import { FirelordFirestore } from './firelordFirestore'
import { ServerTimestamp, FieldValues } from './fieldValue'
import { ObjectFlattenRead } from './objectFlatten'
import { NotTreatedAsObjectType } from './ref'

type NoneAndPrevious = 'none' | 'previous'

// this is a controlled type that make sure 'none' is part of FirelordFirestore.SnapshotOptions['serverTimestamps']
// if firestore change the object literal type then we would know
IsTrue<
	NoneAndPrevious extends FirelordFirestore.SnapshotOptions['serverTimestamps']
		? true
		: false
>()

export type RecursiveUnionReadServerTimestampWithNull<T, Read> =
	T extends ServerTimestamp
		? Read | null
		: T extends FieldValues | NotTreatedAsObjectType
		? Read
		: T extends Record<string, unknown>
		? Read extends Record<string, unknown>
			? {
					[K in keyof T &
						keyof Read]: RecursiveUnionReadServerTimestampWithNull<
						T[K],
						Read[K]
					>
			  }
			: never // impossible route
		: Read

export type UnionReadServerTimestampWithNull<
	T extends MetaType,
	SnapshotOptions extends FirelordFirestore.SnapshotOptions = never
> = SnapshotOptions['serverTimestamps'] extends NoneAndPrevious // default type is never, but default value is also none, so it is ok
	? RecursiveUnionReadServerTimestampWithNull<T['write'], T['read']>
	: T['read']

export type UnionReadServerTimestampWithNullFlatten<
	T extends MetaType,
	SnapshotOptions extends FirelordFirestore.SnapshotOptions = never
> = SnapshotOptions['serverTimestamps'] extends NoneAndPrevious
	? RecursiveUnionReadServerTimestampWithNull<
			T['writeFlatten'],
			ObjectFlattenRead<T['read']>
	  >
	: ObjectFlattenRead<T['read']>
