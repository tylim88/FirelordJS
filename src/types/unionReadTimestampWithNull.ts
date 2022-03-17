import { IsTrue } from './utils'
import { MetaTypes } from './creator'
import { FirelordFirestore } from './firelordFirestore'
import { ServerTimestampFieldValue, FieldValues } from './fieldValue'
import { ObjectFlattenRead } from './objectFlatten'
import { NotTreatedAsObjectType } from './ref'

type none = 'none'

// this is a controlled type that make sure 'none' is part of FirelordFirestore.SnapshotOptions['serverTimestamps']
// if firestore change the object literal type then we would know
IsTrue<
	none extends FirelordFirestore.SnapshotOptions['serverTimestamps']
		? true
		: false
>()

export type RecursiveUnionReadServerTimestampWithNull<T, Read> =
	T extends ServerTimestampFieldValue
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
	T extends MetaTypes,
	SnapshotOptions extends FirelordFirestore.SnapshotOptions = never
> = SnapshotOptions['serverTimestamps'] extends none // default type is never, but default value is also none, so it is ok
	? RecursiveUnionReadServerTimestampWithNull<T['write'], T['read']>
	: T['read']

export type UnionReadServerTimestampWithNullFlatten<
	T extends MetaTypes,
	SnapshotOptions extends FirelordFirestore.SnapshotOptions = never
> = SnapshotOptions['serverTimestamps'] extends none
	? RecursiveUnionReadServerTimestampWithNull<
			T['writeFlatten'],
			ObjectFlattenRead<T['read']>
	  >
	: ObjectFlattenRead<T['read']>
