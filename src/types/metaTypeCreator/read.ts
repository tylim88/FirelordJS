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
	DeleteField,
	ServerTimestamp,
	PossiblyReadAsUndefined,
} from '../fieldValues'
import { DocumentReference } from '../refs'
import { MetaType } from './metaType'

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
			: T extends DeleteField | PossiblyReadAsUndefined
			? undefined
			: T extends UnassignedAbleFieldValue
			? ErrorUnassignedAbleFieldValue
			:
					| NoUndefinedAndBannedTypes<T, BannedTypes>
					| allFieldsPossiblyReadAsUndefined
	>
