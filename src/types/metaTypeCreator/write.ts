import { Timestamp, Bytes, GeoPoint } from '../alias'
import {
	ErrorFieldValueInArray,
	ErrorUnassignedAbleFieldValue,
	NoUndefinedAndBannedTypes,
	NoDirectNestedArray,
} from '../error'
import {
	FieldValues,
	UnassignedAbleFieldValue,
	ArrayUnionOrRemove,
	Increment,
	Delete,
	ServerTimestamp,
	PossiblyReadAsUndefined,
} from '../fieldValues'
import { DeepValue } from '../objectFlatten'
import { DocumentReference } from '../refs'
import { MetaType } from './metaType'
import {
	JSONDate,
	JSONGeoPoint,
	JSONServerTimestamp,
	JSONDocumentReference,
	JSONTimestamp,
} from '../serial'

type ArrayWriteConverter<T, BannedTypes> = NoDirectNestedArray<
	T,
	T extends (infer A)[]
		? readonly ArrayWriteConverter<A, BannedTypes>[]
		: T extends FieldValues
		? ErrorFieldValueInArray
		: T extends Timestamp | Date | JSONDate | JSONTimestamp
		? Timestamp | Date
		: T extends DocumentReference<MetaType> | Bytes | GeoPoint
		? T
		: T extends JSONDocumentReference<infer R>
		? DocumentReference<R>
		: T extends JSONGeoPoint
		? GeoPoint
		: T extends Record<string, unknown>
		? {
				[K in keyof T]-?: ArrayWriteConverter<T[K], BannedTypes>
		  }
		: T extends PossiblyReadAsUndefined
		? never
		: NoUndefinedAndBannedTypes<T, BannedTypes>
>

export type WriteConverter<T, BannedTypes> = NoDirectNestedArray<
	T,
	T extends (infer A)[]
		?
				| readonly ArrayWriteConverter<A, BannedTypes>[]
				| ArrayUnionOrRemove<ArrayWriteConverter<A, BannedTypes>>
		: T extends DocumentReference<MetaType> | ServerTimestamp | GeoPoint
		? T
		: T extends JSONServerTimestamp
		? ServerTimestamp
		: T extends JSONDocumentReference<infer R>
		? DocumentReference<R>
		: T extends JSONGeoPoint
		? GeoPoint
		: T extends number
		? number extends T
			? T | Increment
			: T
		: T extends Timestamp | Date | JSONDate | JSONTimestamp
		? Timestamp | Date
		: T extends Record<string, unknown>
		? {
				[K in keyof T]-?: WriteConverter<T[K], BannedTypes>
		  }
		: T extends UnassignedAbleFieldValue
		? ErrorUnassignedAbleFieldValue
		: T extends PossiblyReadAsUndefined | Delete
		? never
		: NoUndefinedAndBannedTypes<T, BannedTypes>
>

export type WriteUpdateConverter<T, BannedTypes> = NoDirectNestedArray<
	T,
	T extends (infer A)[]
		?
				| readonly ArrayWriteConverter<A, BannedTypes>[]
				| ArrayUnionOrRemove<ArrayWriteConverter<A, BannedTypes>>
		: T extends
				| DocumentReference<MetaType>
				| ServerTimestamp
				| Delete
				| GeoPoint
		? T
		: T extends JSONServerTimestamp
		? ServerTimestamp
		: T extends JSONDocumentReference<infer R>
		? DocumentReference<R>
		: T extends JSONGeoPoint
		? GeoPoint
		: T extends number
		? number extends T
			? T | Increment
			: T
		: T extends Timestamp | Date | JSONDate | JSONTimestamp
		? Timestamp | Date
		: T extends Record<string, unknown>
		? {
				[K in keyof T]-?: WriteUpdateConverter<
					DeepValue<T, K & string>,
					BannedTypes
				>
		  }
		: T extends UnassignedAbleFieldValue
		? ErrorUnassignedAbleFieldValue
		: T extends PossiblyReadAsUndefined
		? never
		: NoUndefinedAndBannedTypes<T, BannedTypes>
>
