import { Timestamp, Bytes, GeoPoint } from '../alias'
import {
	ErrorFieldValueInArray,
	ErrorUnassignedAbleFieldValue,
	NoUndefinedAndBannedTypes,
	NoDirectNestedArray,
	ErrorPossiblyUndefinedAsArrayElement,
} from '../error'
import {
	FieldValues,
	UnassignedAbleFieldValue,
	Delete,
	ServerTimestamp,
	PossiblyReadAsUndefined,
} from '../fieldValues'
import { DocumentReference } from '../refs'
import { MetaType } from './metaType'
import { JSONGeoPoint, JSONDocumentReference, JSONTimestamp } from '../json'

type ReadConverterArray<
	T,
	allFieldsPossiblyReadAsUndefined,
	BannedTypes,
	InArray extends boolean
> = NoDirectNestedArray<
	T,
	T extends (infer A)[]
		?
				| ReadConverterArray<
						A,
						allFieldsPossiblyReadAsUndefined,
						BannedTypes,
						true
				  >[]
				| (InArray extends true ? never : allFieldsPossiblyReadAsUndefined)
		: T extends FieldValues
		? ErrorFieldValueInArray
		: T extends Date | Timestamp
		?
				| Timestamp
				| (InArray extends true ? never : allFieldsPossiblyReadAsUndefined)
		: T extends DocumentReference<MetaType> | Bytes | GeoPoint
		? T | (InArray extends true ? never : allFieldsPossiblyReadAsUndefined)
		: T extends Record<string, unknown>
		?
				| {
						[K in keyof T]-?: ReadConverterArray<
							T[K],
							allFieldsPossiblyReadAsUndefined,
							BannedTypes,
							false
						>
				  }
				| (InArray extends true ? never : allFieldsPossiblyReadAsUndefined)
		: T extends PossiblyReadAsUndefined
		? InArray extends true
			? ErrorPossiblyUndefinedAsArrayElement
			: undefined
		:
				| NoUndefinedAndBannedTypes<T, BannedTypes>
				| allFieldsPossiblyReadAsUndefined
>

export type ReadConverter<T, allFieldsPossiblyReadAsUndefined, BannedTypes> =
	NoDirectNestedArray<
		T,
		T extends (infer A)[]
			?
					| ReadConverterArray<
							A,
							allFieldsPossiblyReadAsUndefined,
							BannedTypes,
							true
					  >[]
					| allFieldsPossiblyReadAsUndefined
			: T extends ServerTimestamp | Date | Timestamp
			? Timestamp | allFieldsPossiblyReadAsUndefined
			: T extends DocumentReference<MetaType> | Bytes | GeoPoint
			? T | allFieldsPossiblyReadAsUndefined
			: T extends Record<string, unknown>
			?
					| {
							[K in keyof T]-?: ReadConverter<
								T[K],
								allFieldsPossiblyReadAsUndefined,
								BannedTypes
							>
					  }
					| allFieldsPossiblyReadAsUndefined
			: T extends Delete | PossiblyReadAsUndefined
			? undefined
			: T extends UnassignedAbleFieldValue
			? ErrorUnassignedAbleFieldValue
			:
					| NoUndefinedAndBannedTypes<T, BannedTypes>
					| allFieldsPossiblyReadAsUndefined
	>

type ReadJSONConverterArray<
	T,
	allFieldsPossiblyReadAsUndefined,
	BannedTypes,
	InArray extends boolean
> = NoDirectNestedArray<
	T,
	T extends (infer A)[]
		?
				| ReadJSONConverterArray<
						A,
						allFieldsPossiblyReadAsUndefined,
						BannedTypes,
						true
				  >[]
				| (InArray extends true ? never : allFieldsPossiblyReadAsUndefined)
		: T extends FieldValues
		? ErrorFieldValueInArray
		: T extends Date | Timestamp
		?
				| JSONTimestamp
				| (InArray extends true ? never : allFieldsPossiblyReadAsUndefined)
		: T extends DocumentReference<infer R>
		?
				| JSONDocumentReference<R>
				| (InArray extends true ? never : allFieldsPossiblyReadAsUndefined)
		: T extends GeoPoint
		?
				| JSONGeoPoint
				| (InArray extends true ? never : allFieldsPossiblyReadAsUndefined)
		: T extends Bytes
		? T | (InArray extends true ? never : allFieldsPossiblyReadAsUndefined)
		: T extends Record<string, unknown>
		?
				| {
						[K in keyof T]-?: ReadJSONConverterArray<
							T[K],
							allFieldsPossiblyReadAsUndefined,
							BannedTypes,
							false
						>
				  }
				| (InArray extends true ? never : allFieldsPossiblyReadAsUndefined)
		: T extends PossiblyReadAsUndefined
		? InArray extends true
			? ErrorPossiblyUndefinedAsArrayElement
			: undefined
		:
				| NoUndefinedAndBannedTypes<T, BannedTypes>
				| allFieldsPossiblyReadAsUndefined
>

export type ReadJSONConverter<
	T,
	allFieldsPossiblyReadAsUndefined,
	BannedTypes
> = NoDirectNestedArray<
	T,
	T extends (infer A)[]
		?
				| ReadJSONConverterArray<
						A,
						allFieldsPossiblyReadAsUndefined,
						BannedTypes,
						true
				  >[]
				| allFieldsPossiblyReadAsUndefined
		: T extends ServerTimestamp | Date | Timestamp
		? JSONTimestamp | allFieldsPossiblyReadAsUndefined
		: T extends DocumentReference<infer R>
		? JSONDocumentReference<R> | allFieldsPossiblyReadAsUndefined
		: T extends GeoPoint
		? JSONGeoPoint | allFieldsPossiblyReadAsUndefined
		: T extends Bytes
		? T | allFieldsPossiblyReadAsUndefined
		: T extends Record<string, unknown>
		?
				| {
						[K in keyof T]-?: ReadJSONConverter<
							T[K],
							allFieldsPossiblyReadAsUndefined,
							BannedTypes
						>
				  }
				| allFieldsPossiblyReadAsUndefined
		: T extends Delete | PossiblyReadAsUndefined
		? undefined
		: T extends UnassignedAbleFieldValue
		? ErrorUnassignedAbleFieldValue
		:
				| NoUndefinedAndBannedTypes<T, BannedTypes>
				| allFieldsPossiblyReadAsUndefined
>
