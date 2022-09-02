import { MetaType } from './metaTypeCreator'
import { SnapshotOptions } from './alias'
import { ServerTimestamp } from './fieldValue'
import { ObjectFlattenShallow } from './objectFlatten'

type None = 'none'
type Previous = 'previous'
export type NoneAndPrevious = None | Previous

export type RecursiveUnionReadServerTimestampWithNull<T, Read> =
	T extends ServerTimestamp
		? Read | null
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
	SnapshotOptions_ extends SnapshotOptions = { serverTimestamps: None }
> = SnapshotOptions_['serverTimestamps'] extends NoneAndPrevious // default type is never, but default value is also none, so it is ok
	? RecursiveUnionReadServerTimestampWithNull<T['write'], T['read']>
	: T['read']

export type UnionReadServerTimestampWithNullFlatten<
	T extends MetaType,
	SnapshotOptions_ extends SnapshotOptions = { serverTimestamps: None }
> = SnapshotOptions_['serverTimestamps'] extends NoneAndPrevious
	? RecursiveUnionReadServerTimestampWithNull<
			T['writeFlatten'],
			ObjectFlattenShallow<T['read']>
	  >
	: ObjectFlattenShallow<T['read']>
