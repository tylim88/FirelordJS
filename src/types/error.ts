export type ErrorUndefined = 'Error: undefined is not a valid Firestore type'
export type ErrorNullBanned = 'Error: Null type is banned in the setting'
export type ErrorTypesBanned = 'Error: This type(s) is banned in the setting'
export type ErrorDirectNested =
	'Error: Direct Nested Array is not a valid Firestore type'
export type ErrorFieldValueInArray =
	'Error: Field Value is not a valid data type in array, directly or indirectly'
export type ErrorUnassignedAbleFieldValue =
	'Error: Please do not directly assign Increment, Array Remove and Array Union Field Value'
export type ErrorUnionInvolveObjectType =
	'Error: Please check your type declaration, do not union object literal type with other type except PossiblyReadAsUndefined'
export type ErrorDeleteFieldMerge =
	`Error: To use deleteField, please set ( merge ) to ( true ) or set ( mergeFields with an array, empty array also fine ) in the options parameter.`
export type ErrorDeleteFieldUnion<T extends string> =
	`Error: To use ( deleteField() ) on ( ${T} ), please union ( DeleteField ) type with ${T}'s type in the type definition(MetaTypeCreator)`
export type ErrorPleaseDoConstAssertion =
	`Error: Please assert the value as const eg:( 'a' as const )`
export type ErrorCollectionIDString =
	'Error: Collection ID type cannot be string'
export type ErrorEndOfID =
	'Error: ID or Path cannot end in a forward slash ( / )'
export type ErrorInvalidDocumentOrCollectionID<
	T extends 'Document' | 'Collection',
	Type extends 'ID' | 'Path'
> = `Error: ${T} ${Type} cannot contains ${Type extends 'ID'
	? 'forward slash ( / ), '
	: ''}double dots ( .. ) and double underscore ( __ )`
export type ErrorInvalidDocumentOrCollectionIDStart<
	T extends 'Document' | 'Collection'
> = `Error: ${T} ID cannot start with a dot ( . )`
export type ErrorEmptyDocumentOrCollectionID<
	T extends 'Document' | 'Collection'
> = `Error: ${T} ID is empty`
export type ErrorNumberOfForwardSlashIsNotEqual<
	Correct extends number,
	Current extends number
> = `Error: ${Current extends 0
	? `You need to assert your value for documentId() as const, eg: ( 'a/b/c' as const ) or else the forward slash count would be 0`
	: `Invalid query, forward slash count mismatched`}, current count is ${Current}, need ${Correct}.`
export type ErrorEmptyUpdate = 'Error: Update data is an empty object literal'
export type ErrorPossiblyUndefinedAsArrayElement =
	`Error: You cannot assign PossiblyUndefined as array element, eg: ( PossiblyUndefined[] ), you can however indirectly assign PossiblyUndefined in array, eg: < { a : number | PossiblyUndefined }[] >`
export type ErrorMoreThanOnceDocSnapshotInCursor =
	'Error: If cursors has a DocumentSnapshot(or QueryDocumentSnapshot) argument, then DocumentSnapshot(or QueryDocumentSnapshot) should be the one and only argument'
export type ErrorLimitInvalidNumber =
	'Error: do not use negative, 0 or decimal value'
export type ErrorLimitToLastOrderBy =
	'Error: You must specify at least one orderBy clause for limitToLast queries'
export type ErrorWhereCompareValueMustBeArray<T extends string> =
	`Error: ${T} is not an array, you can only use ( array-contains ) and ( array-contains-any ) on array data type`
export type ErrorWhereOrderByAndInEquality<
	OrderByField extends string,
	WhereField extends string
> = `Error: Invalid query. You have a where filter with an inequality ( <, <=, !=, not-in, >, or >= ) on field ( ${WhereField &
	string} ) and so you must also use ( ${WhereField &
	string} ) as your first argument to orderBy(), but your first orderBy() is on field ( ${OrderByField &
	string} ) instead.`
export type ErrorWhereOrderByEquality =
	`Error: You can't order your query by a field included in an equality ( == ) or ( in ) clause.`
export type ErrorWhereNotInArrayContainsAny =
	`Error: You can use at most one ( in, not-in, or array-contains-any ) clause per query. You can't combine ( in, not-in, and array-contains-any ) in the same query.`
export type ErrorWhereNotInNotEqual =
	`Error: You can't combine ( not-in ) with not equals ( != ).`
export type ErrorWhereArrayContainsArrayContainsAny =
	`You can use at most one array-contains clause per query. You can't combine array-contains with array-contains-any.`
export type ErrorWhereInequalityOpStrSameField =
	`Invalid query. All where filters with an inequality (<, <=, !=, not-in, >, or >=) must be on the same field path.`
export type ErrorWhereOnlyOneNotEqual =
	`Error: You cannot use more than one ( != ) filter.`
export type ErrorWhereNoNeverEmptyArray =
	`Error: No Empty Array ( never[] ) in ( in, not-in, array-contains-any ) filter`
export type ErrorCursorTooManyArguments =
	`Error: Too many arguments provided to startAt/startAfter/endAt/endBefore(). The number of arguments must be less than or equal to the number of orderBy() clauses than come before it`
export type ErrorUnknownMember<T> =
	`Error: Please remove the unknown member ( ${T & string} )`
export type ErrorWhereDocumentFieldPath =
	'If field path is document ID, then value must be string'
export type ErrorWhere__name__ =
	"Error: Dont use ( __name__ ) directly as where's field path, use documentId() sentinel field path instead."
export type ErrorCursor__name__ =
	'Error: detected type is string, please do const assertion'
export type ErrorArrayFieldValueEmpty =
	'Error: arrayUnion and arrayRemove need at least 1 argument'
export type ErrorEmptyCursor = 'Error: cursor need at least 1 argument.'
export type ErrorCursorNoArray =
	'Error: cursor rest parameter must be tuple type, not array type. Use const assertion to transform array type to tuple type'

export type ErrorMsgs =
	| ErrorUndefined
	| ErrorNullBanned
	| ErrorTypesBanned
	| ErrorDirectNested
	| ErrorFieldValueInArray
	| ErrorEmptyDocumentOrCollectionID<'Document' | 'Collection'>
	| ErrorUnassignedAbleFieldValue
	| ErrorUnionInvolveObjectType
	| ErrorDeleteFieldMerge
	| ErrorDeleteFieldUnion<string>
	| ErrorNumberOfForwardSlashIsNotEqual<number, number>
	| ErrorPleaseDoConstAssertion
	| ErrorEndOfID
	| ErrorCollectionIDString
	| ErrorInvalidDocumentOrCollectionID<'Document' | 'Collection', 'ID' | 'Path'>
	| ErrorInvalidDocumentOrCollectionIDStart<'Document' | 'Collection'>
	| ErrorEmptyUpdate
	| ErrorMoreThanOnceDocSnapshotInCursor
	| ErrorLimitInvalidNumber
	| ErrorLimitToLastOrderBy
	| ErrorWhereOrderByAndInEquality<string, string>
	| ErrorWhereCompareValueMustBeArray<string>
	| ErrorWhereOrderByEquality
	| ErrorWhereNotInArrayContainsAny
	| ErrorWhereArrayContainsArrayContainsAny
	| ErrorWhereInequalityOpStrSameField
	| ErrorWhereOnlyOneNotEqual
	| ErrorCursorTooManyArguments
	| ErrorUnknownMember<string>
	| ErrorWhereDocumentFieldPath
	| ErrorWhere__name__
	| ErrorWhereNoNeverEmptyArray
	| ErrorCursor__name__
	| ErrorArrayFieldValueEmpty
	| ErrorEmptyCursor
	| ErrorCursorNoArray

export type ReplaceErrorMsgsWithNever<T> = T extends ErrorMsgs ? never : T // ! not yet implemented anywhere

export type NoUndefinedAndBannedTypes<Data, BannedTypes> =
	Data extends undefined
		? ErrorUndefined
		: Data extends BannedTypes
		? BannedTypes extends null
			? ErrorNullBanned
			: ErrorTypesBanned
		: Data extends ErrorUndefined
		? never
		: Data

export type NoDirectNestedArray<Data, Output> = Data extends unknown[][]
	? ErrorDirectNested
	: Output
