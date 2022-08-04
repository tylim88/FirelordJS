import { Timestamp } from './ori'
import {
	ErrorFieldValueInArray,
	ErrorUnassignedAbleFieldValue,
	NoUndefinedAndBannedTypes,
	NoDirectNestedArray,
	ErrorPossiblyUndefinedAsArrayElement,
	ErrorCollectionIDString,
} from './error'
import { IsValidID } from './validID'
import {
	FieldValues,
	UnassignedAbleFieldValue,
	ArrayUnionOrRemove,
	Increment,
	DeleteField,
	ServerTimestamp,
	PossiblyReadAsUndefined,
} from './fieldValue'
import { ObjectFlattenHybrid } from './objectFlatten'
import {
	RecursiveExcludePossiblyUndefinedFieldValue,
	RecursiveReplaceUnionInvolveObjectTypeWithErrorMsg,
} from './markUnionObjectAsError'

export type MetaType = {
	collectionPath: string
	collectionID: string
	docID: string
	docPath: string
	read: Record<string, unknown>
	write: Record<string, unknown>
	writeFlatten: Record<string, unknown>
	compare: Record<string, unknown>
	base: Record<string, unknown>
	parent: MetaType | null
	ancestors: MetaType[]
}

export type MetaTypeCreator<
	Base extends Record<string, unknown>,
	CollectionID extends string,
	DocID extends string = string,
	Parent extends MetaType | null = null,
	Settings extends {
		allFieldsPossiblyReadAsUndefined?: boolean
		banNull?: boolean
	} = { allFieldsPossiblyReadAsUndefined: false; banNull: false }
> = {
	base: Base
	read: {
		[J in keyof RecursiveReplaceUnionInvolveObjectTypeWithErrorMsg<Base>]-?: ReadConverter<
			RecursiveReplaceUnionInvolveObjectTypeWithErrorMsg<Base>[J],
			Settings['allFieldsPossiblyReadAsUndefined'] extends true
				? undefined
				: never,
			Settings['banNull'] extends true ? null : never
		>
	}
	// so it looks more explicit in typescript hint
	write: {
		[J in keyof RecursiveReplaceUnionInvolveObjectTypeWithErrorMsg<
			RecursiveExcludePossiblyUndefinedFieldValue<Base>
		>]-?: WriteConverter<
			RecursiveReplaceUnionInvolveObjectTypeWithErrorMsg<
				RecursiveExcludePossiblyUndefinedFieldValue<Base>
			>[J],
			Settings['banNull'] extends true ? null : never
		>
	}
	writeFlatten: {
		[J in keyof ObjectFlattenHybrid<
			RecursiveReplaceUnionInvolveObjectTypeWithErrorMsg<
				RecursiveExcludePossiblyUndefinedFieldValue<Base>
			>
		>]-?: WriteConverter<
			ObjectFlattenHybrid<
				RecursiveReplaceUnionInvolveObjectTypeWithErrorMsg<
					RecursiveExcludePossiblyUndefinedFieldValue<Base>
				>
			>[J],
			Settings['banNull'] extends true ? null : never
		>
	}
	compare: {
		[J in keyof ObjectFlattenHybrid<
			RecursiveReplaceUnionInvolveObjectTypeWithErrorMsg<
				RecursiveExcludePossiblyUndefinedFieldValue<Base>
			>
		>]-?: CompareConverter<
			ObjectFlattenHybrid<
				RecursiveReplaceUnionInvolveObjectTypeWithErrorMsg<
					RecursiveExcludePossiblyUndefinedFieldValue<Base>
				>
			>[J],
			Settings['banNull'] extends true ? null : never
		>
	}

	collectionID: NoUndefinedAndBannedTypes<
		string extends CollectionID
			? ErrorCollectionIDString
			: IsValidID<CollectionID, 'Collection', 'ID'>,
		never
	>
	collectionPath: Parent extends MetaType
		? `${Parent['collectionPath']}/${Parent['docID']}/${CollectionID}`
		: CollectionID
	docID: IsValidID<DocID, 'Document', 'ID'>
	docPath: Parent extends MetaType
		? `${Parent['collectionPath']}/${Parent['docID']}/${CollectionID}/${DocID}`
		: `${CollectionID}/${DocID}`
	parent: Parent
	ancestors: Parent extends MetaType
		? [
				...Parent['ancestors'],
				MetaTypeCreator<Base, CollectionID, DocID, Parent, Settings>
		  ]
		: [MetaTypeCreator<Base, CollectionID, DocID, Parent, Settings>]
}

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
		: T extends PossiblyReadAsUndefined
		? InArray extends true
			? ErrorPossiblyUndefinedAsArrayElement
			: undefined
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
		:
				| NoUndefinedAndBannedTypes<T, BannedTypes>
				| allFieldsPossiblyReadAsUndefined
>

type ReadConverter<T, allFieldsPossiblyReadAsUndefined, BannedTypes> =
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
			: T extends DeleteField | PossiblyReadAsUndefined
			? undefined
			: T extends UnassignedAbleFieldValue
			? ErrorUnassignedAbleFieldValue
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
			:
					| NoUndefinedAndBannedTypes<T, BannedTypes>
					| allFieldsPossiblyReadAsUndefined
	>

type CompareConverterArray<T, BannedTypes> = NoDirectNestedArray<
	T,
	T extends (infer A)[]
		? CompareConverterArray<A, BannedTypes>[]
		: T extends FieldValues
		? ErrorFieldValueInArray
		: T extends Date | Timestamp
		? Timestamp | Date
		: T extends PossiblyReadAsUndefined
		? never
		: T extends Record<string, unknown>
		? {
				[K in keyof T]-?: CompareConverterArray<T[K], BannedTypes>
		  }
		: NoUndefinedAndBannedTypes<T, BannedTypes>
>

type CompareConverter<T, BannedTypes> = NoDirectNestedArray<
	T,
	T extends (infer A)[]
		? CompareConverterArray<A, BannedTypes>[]
		: T extends ServerTimestamp | Date | Timestamp
		? Timestamp | Date
		: T extends UnassignedAbleFieldValue
		? ErrorUnassignedAbleFieldValue
		: T extends PossiblyReadAsUndefined | DeleteField
		? never
		: T extends Record<string, unknown>
		? {
				[K in keyof T]-?: CompareConverter<T[K], BannedTypes>
		  }
		: NoUndefinedAndBannedTypes<T, BannedTypes>
>

type ArrayWriteConverter<T, BannedTypes> = NoDirectNestedArray<
	T,
	T extends (infer A)[]
		? ArrayWriteConverter<A, BannedTypes>[]
		: T extends FieldValues
		? ErrorFieldValueInArray
		: T extends Timestamp | Date
		? Timestamp | Date
		: T extends PossiblyReadAsUndefined
		? never
		: T extends Record<string, unknown>
		? {
				[K in keyof T]-?: ArrayWriteConverter<T[K], BannedTypes>
		  }
		: NoUndefinedAndBannedTypes<T, BannedTypes>
>

type WriteConverter<T, BannedTypes> = NoDirectNestedArray<
	T,
	T extends (infer A)[]
		?
				| ArrayWriteConverter<A, BannedTypes>[]
				| ArrayUnionOrRemove<ArrayWriteConverter<A, BannedTypes>>
		: T extends ServerTimestamp
		? ServerTimestamp
		: T extends number
		? number extends T
			? T | Increment
			: T
		: T extends DeleteField
		? DeleteField
		: T extends UnassignedAbleFieldValue
		? ErrorUnassignedAbleFieldValue
		: T extends Timestamp | Date
		? Timestamp | Date
		: T extends PossiblyReadAsUndefined
		? never
		: T extends Record<string, unknown>
		? {
				[K in keyof T]-?: WriteConverter<T[K], BannedTypes>
		  }
		: NoUndefinedAndBannedTypes<T, BannedTypes>
>
