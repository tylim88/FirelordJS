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
import {
	JSONDate,
	JSONGeoPoint,
	JSONServerTimestamp,
	JSONDocumentReference,
	JSONTimestamp,
	JSON,
} from '../json'
import { ReMap } from '../utils'

export type OmitSymbol<T extends JSON<unknown>> = ReMap<Omit<T, ''>>

type ReadConverterArray<
	T,
	allFieldsPossiblyReadAsUndefined,
	BannedTypes,
	InArray extends boolean
> = (
	InArray extends true ? never : allFieldsPossiblyReadAsUndefined
) extends infer U
	? NoDirectNestedArray<
			T,
			T extends (infer A)[]
				?
						| ReadConverterArray<
								A,
								allFieldsPossiblyReadAsUndefined,
								BannedTypes,
								true
						  >[]
						| U
				: T extends FieldValues
				? ErrorFieldValueInArray
				: T extends Date | Timestamp
				? Timestamp | U
				: T extends DocumentReference<MetaType> | Bytes | GeoPoint
				? T | U
				: T extends JSONDate | JSONTimestamp
				? OmitSymbol<JSONTimestamp> | U
				: T extends JSONGeoPoint | JSONDocumentReference<MetaType>
				? OmitSymbol<T> | U
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
						| U
				: T extends PossiblyReadAsUndefined
				? InArray extends true
					? ErrorPossiblyUndefinedAsArrayElement
					: undefined
				:
						| NoUndefinedAndBannedTypes<T, BannedTypes>
						| allFieldsPossiblyReadAsUndefined
	  >
	: never

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
			: T extends JSONDate | JSONTimestamp | JSONServerTimestamp
			? OmitSymbol<JSONTimestamp>
			: T extends JSONGeoPoint | JSONDocumentReference<MetaType>
			? OmitSymbol<T>
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
