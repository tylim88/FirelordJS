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
} from '../json'

type CompareConverterArray<T, BannedTypes> = NoDirectNestedArray<
	T,
	T extends (infer A)[]
		? readonly CompareConverterArray<A, BannedTypes>[]
		: T extends FieldValues
		? ErrorFieldValueInArray
		: T extends Date | Timestamp | JSONDate | JSONTimestamp
		? Timestamp | Date
		: T extends JSONDocumentReference<infer R>
		? DocumentReference<R>
		: T extends JSONGeoPoint
		? GeoPoint
		: T extends DocumentReference<MetaType> | Bytes | GeoPoint
		? T
		: T extends Record<string, unknown>
		? {
				[K in keyof T]-?: CompareConverterArray<T[K], BannedTypes>
		  }
		: T extends PossiblyReadAsUndefined
		? never
		: NoUndefinedAndBannedTypes<T, BannedTypes>
>

export type CompareConverter<T, BannedTypes> = NoDirectNestedArray<
	T,
	T extends (infer A)[]
		? readonly CompareConverterArray<A, BannedTypes>[]
		: T extends
				| ServerTimestamp
				| Date
				| Timestamp
				| JSONDate
				| JSONTimestamp
				| JSONServerTimestamp
		? Timestamp | Date
		: T extends JSONGeoPoint
		? GeoPoint
		: T extends JSONDocumentReference<MetaType>
		? DocumentReference<MetaType>
		: T extends DocumentReference<MetaType> | Bytes | GeoPoint | JSONGeoPoint
		? T
		: T extends Record<string, unknown>
		? {
				[K in keyof T]-?: CompareConverter<
					DeepValue<T, K & string>,
					BannedTypes
				>
		  }
		: T extends UnassignedAbleFieldValue
		? ErrorUnassignedAbleFieldValue
		: T extends PossiblyReadAsUndefined | Delete
		? never
		: NoUndefinedAndBannedTypes<T, BannedTypes>
>
