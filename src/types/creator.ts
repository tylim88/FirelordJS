import { FirelordFirestore } from './firelordFirestore'
import {
	ErrorFieldValueInArray,
	ErrorEmptyDocumentOrCollectionID,
	ErrorUnassignedAbleFieldValue,
	NoUndefinedAndBannedTypes,
	NoDirectNestedArray,
	ErrorInvalidDocumentOrCollectionID,
	ErrorInvalidDocumentOrCollectionIDStart,
	ErrorPossiblyUndefinedAsArrayElement,
	ErrorCollectionIDString,
} from './error'
import {
	FieldValues,
	UnassignedAbleFieldValue,
	ArrayFieldValue,
	NumberFieldValue,
	DeleteAbleFieldValue,
	ServerTimestampFieldValue,
	PossiblyReadAsUndefinedFieldValue,
} from './fieldValue'
import { ObjectFlattenHybrid } from './objectFlatten'
import {
	RecursiveExcludePossiblyUndefinedFieldValue,
	RecursiveReplaceUnionInvolveObjectTypeWithErrorMsg,
} from './markUnionObjectAsError'
import { NotTreatedAsObjectType } from './ref'

export type MetaTypes = {
	collectionPath: string
	collectionID: string
	docID: string
	docPath: string
	read: Record<string, unknown>
	write: Record<string, unknown>
	writeFlatten: Record<string, unknown>
	compare: Record<string, unknown>
	base: Record<string, unknown>
	ancestors: { docID: string; collectionID: string }[]
}

type InvalidIDCharacter = '/' | '..'
// ID type check is overkill, just for fun
export type IsValidID<
	ID extends string,
	Mode extends 'Document' | 'Collection'
> = ID extends NoUndefinedAndBannedTypes<ID, never>
	? ID extends ''
		? ErrorEmptyDocumentOrCollectionID<Mode>
		: ID extends `.${infer Rest}`
		? ErrorInvalidDocumentOrCollectionIDStart<Mode>
		: ID extends `.`
		? ErrorInvalidDocumentOrCollectionIDStart<Mode>
		: ID extends `${infer Head}${infer Middle}${infer Tail}`
		? Head extends InvalidIDCharacter
			? ErrorInvalidDocumentOrCollectionID<Mode>
			: Middle extends InvalidIDCharacter
			? ErrorInvalidDocumentOrCollectionID<Mode>
			: Tail extends InvalidIDCharacter
			? ErrorInvalidDocumentOrCollectionID<Mode>
			: ID
		: ID extends `${infer Head}${infer Tail}`
		? Head extends InvalidIDCharacter
			? ErrorInvalidDocumentOrCollectionID<Mode>
			: Tail extends InvalidIDCharacter
			? ErrorInvalidDocumentOrCollectionID<Mode>
			: ID
		: ID extends `${infer Head}`
		? Head extends InvalidIDCharacter
			? ErrorInvalidDocumentOrCollectionID<Mode>
			: ID
		: ID
	: NoUndefinedAndBannedTypes<ID, never>

export type Creator<
	Base extends Record<string, unknown>,
	CollectionID extends string,
	DocID extends string,
	Parent extends {
		collectionPath: string
		docID: string
		ancestors: { docID: string; collectionID: string }[]
	} = {
		collectionPath: never
		docID: never
		ancestors: never
	},
	Settings extends {
		allFieldsPossiblyUndefined?: boolean
		banNull?: boolean
	} = { allFieldsPossiblyUndefined: false; banNull: false }
> = {
	base: Base
	read: {
		[J in keyof RecursiveReplaceUnionInvolveObjectTypeWithErrorMsg<Base>]-?: ReadConverter<
			RecursiveReplaceUnionInvolveObjectTypeWithErrorMsg<Base>[J],
			Settings['allFieldsPossiblyUndefined'] extends true ? undefined : never,
			Settings['banNull'] extends true ? null : never
		>
	}
	// so it looks more explicit in typescript hint
	write: {
		[J in keyof RecursiveReplaceUnionInvolveObjectTypeWithErrorMsg<Base>]-?: WriteConverter<
			RecursiveReplaceUnionInvolveObjectTypeWithErrorMsg<Base>[J],
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
			: IsValidID<CollectionID, 'Collection'>,
		never
	>
	collectionPath: Parent extends {
		collectionPath: never
		docID: never
	}
		? CollectionID
		: `${Parent['collectionPath']}/${Parent['docID']}/${CollectionID}`
	docID: IsValidID<DocID, 'Document'>
	docPath: Parent extends {
		collectionPath: never
		docID: never
	}
		? `${CollectionID}/${DocID}`
		: `${Parent['collectionPath']}/${Parent['docID']}/${CollectionID}/${DocID}`
	ancestors: Parent extends {
		collectionPath: never
		docID: never
		ancestors: never
	}
		? [{ docID: DocID; collectionID: CollectionID }]
		: [...Parent['ancestors'], { docID: DocID; collectionID: CollectionID }]
}

type ReadConverterArray<
	T,
	AllFieldsPossiblyUndefined,
	BannedTypes,
	InArray extends boolean
> = NoDirectNestedArray<T> extends T
	? T extends (infer A)[]
		?
				| ReadConverterArray<A, AllFieldsPossiblyUndefined, BannedTypes, true>[]
				| (InArray extends true ? never : AllFieldsPossiblyUndefined)
		: T extends FieldValues
		? ErrorFieldValueInArray
		: T extends Date | FirelordFirestore.Timestamp
		?
				| FirelordFirestore.Timestamp
				| (InArray extends true ? never : AllFieldsPossiblyUndefined)
		: T extends PossiblyReadAsUndefinedFieldValue
		? InArray extends true
			? ErrorPossiblyUndefinedAsArrayElement
			: undefined
		: T extends NotTreatedAsObjectType
		? T | AllFieldsPossiblyUndefined
		: T extends Record<string, unknown>
		?
				| {
						[K in keyof T]-?: ReadConverterArray<
							T[K],
							AllFieldsPossiblyUndefined,
							BannedTypes,
							false
						>
				  }
				| (InArray extends true ? never : AllFieldsPossiblyUndefined)
		: NoUndefinedAndBannedTypes<T, BannedTypes> | AllFieldsPossiblyUndefined
	: NoUndefinedAndBannedTypes<T, BannedTypes> | AllFieldsPossiblyUndefined

type ReadConverter<T, AllFieldsPossiblyUndefined, BannedTypes> =
	NoDirectNestedArray<T> extends T
		? T extends (infer A)[]
			?
					| ReadConverterArray<
							A,
							AllFieldsPossiblyUndefined,
							BannedTypes,
							true
					  >[]
					| AllFieldsPossiblyUndefined
			: T extends ServerTimestampFieldValue | Date | FirelordFirestore.Timestamp
			? FirelordFirestore.Timestamp | AllFieldsPossiblyUndefined
			: T extends DeleteAbleFieldValue | PossiblyReadAsUndefinedFieldValue
			? undefined
			: T extends UnassignedAbleFieldValue
			? ErrorUnassignedAbleFieldValue
			: T extends NotTreatedAsObjectType
			? T | AllFieldsPossiblyUndefined
			: T extends Record<string, unknown>
			?
					| {
							[K in keyof T]-?: ReadConverter<
								T[K],
								AllFieldsPossiblyUndefined,
								BannedTypes
							>
					  }
					| AllFieldsPossiblyUndefined
			: NoUndefinedAndBannedTypes<T, BannedTypes> | AllFieldsPossiblyUndefined
		: NoUndefinedAndBannedTypes<T, BannedTypes> | AllFieldsPossiblyUndefined

type CompareConverterArray<T, BannedTypes> = NoDirectNestedArray<T> extends T
	? T extends (infer A)[]
		? CompareConverterArray<A, BannedTypes>[]
		: T extends FieldValues
		? ErrorFieldValueInArray
		: T extends Date | FirelordFirestore.Timestamp
		? FirelordFirestore.Timestamp | Date
		: T extends PossiblyReadAsUndefinedFieldValue
		? never
		: T extends NotTreatedAsObjectType
		? T
		: T extends Record<string, unknown>
		? {
				[K in keyof T]-?: CompareConverterArray<T[K], BannedTypes>
		  }
		: NoUndefinedAndBannedTypes<T, BannedTypes>
	: NoUndefinedAndBannedTypes<T, BannedTypes>

type CompareConverter<T, BannedTypes> = NoDirectNestedArray<T> extends T
	? T extends (infer A)[]
		? CompareConverterArray<A, BannedTypes>[]
		: T extends ServerTimestampFieldValue | Date | FirelordFirestore.Timestamp
		? FirelordFirestore.Timestamp | Date
		: T extends UnassignedAbleFieldValue
		? ErrorUnassignedAbleFieldValue
		: T extends PossiblyReadAsUndefinedFieldValue | DeleteAbleFieldValue
		? never
		: T extends NotTreatedAsObjectType
		? T
		: T extends Record<string, unknown>
		? {
				[K in keyof T]-?: CompareConverter<T[K], BannedTypes>
		  }
		: NoUndefinedAndBannedTypes<T, BannedTypes>
	: NoUndefinedAndBannedTypes<T, BannedTypes>

type ArrayWriteConverter<T, BannedTypes> = NoDirectNestedArray<T> extends T
	? T extends (infer A)[]
		? ArrayWriteConverter<A, BannedTypes>[]
		: T extends FieldValues
		? ErrorFieldValueInArray
		: T extends FirelordFirestore.Timestamp | Date
		? FirelordFirestore.Timestamp | Date
		: T extends PossiblyReadAsUndefinedFieldValue
		? never
		: T extends NotTreatedAsObjectType
		? T
		: T extends Record<string, unknown>
		? {
				[K in keyof T]-?: ArrayWriteConverter<T[K], BannedTypes>
		  }
		: NoUndefinedAndBannedTypes<T, BannedTypes>
	: NoUndefinedAndBannedTypes<T, BannedTypes>

type WriteConverter<T, BannedTypes> = NoDirectNestedArray<T> extends T
	? T extends (infer A)[]
		?
				| ArrayWriteConverter<A, BannedTypes>[]
				| ArrayFieldValue<ArrayWriteConverter<A, BannedTypes>>
		: T extends ServerTimestampFieldValue
		? ServerTimestampFieldValue
		: T extends number
		? number extends T
			? T | NumberFieldValue
			: T
		: T extends DeleteAbleFieldValue
		? DeleteAbleFieldValue
		: T extends UnassignedAbleFieldValue
		? ErrorUnassignedAbleFieldValue
		: T extends FirelordFirestore.Timestamp | Date
		? FirelordFirestore.Timestamp | Date
		: T extends PossiblyReadAsUndefinedFieldValue
		? never
		: T extends NotTreatedAsObjectType
		? T
		: T extends Record<string, unknown>
		? {
				[K in keyof T]-?: WriteConverter<T[K], BannedTypes>
		  }
		: NoUndefinedAndBannedTypes<T, BannedTypes>
	: NoUndefinedAndBannedTypes<T, BannedTypes>