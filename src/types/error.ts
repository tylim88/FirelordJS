import { GetNumberOfPathSlash } from './validID'

export type ErrorUndefined = `Error: undefined is not a valid Firestore type`
export type ErrorNullBanned = `Error: Null type is banned in the setting`
export type ErrorTypesBanned = `Error: This type(s) is banned in the setting`
export type ErrorDirectNested =
	`Error: Direct Nested Array is not a valid Firestore type`
export type ErrorFieldValueInArray =
	`Error: Field Value is not a valid data type in array, directly or indirectly`
export type ErrorUnassignedAbleFieldValue =
	`Error: Please do not directly assign Increment, Array Remove and Array Union Field Value`
export type ErrorDeleteFieldMerge =
	`Error: To use deleteField, please set 'merge' to 'true' or set 'mergeFields with an array, empty array also fine' in the options parameter.`
export type ErrorDeleteFieldUnion<T extends string> =
	`Error: To use 'deleteField()' on '${T}', please union 'Delete' type with type of '${T}' in the type definition(MetaTypeCreator)`
export type ErrorPleaseDoConstAssertion =
	`Error: Please assert the value as const eg:''a' as const'`
export type ErrorCollectionIDString =
	`Error: Collection ID type must be string literal and cannot be string,, please check your Meta Type.`
export type ErrorEndOfID = `Error: ID or Path cannot end in a forward slash '/'`
export type ErrorInvalidDocumentOrCollectionID<
	T extends 'Document' | 'Collection',
	Type extends 'ID' | 'Path'
> = `Error: ${T} ${Type} cannot contains ${Type extends 'ID'
	? `forward slash '/', `
	: ``}double dots '..' and double underscore '__' (except "__name__")`
export type ErrorInvalidDocumentOrCollectionIDStart<
	T extends 'Document' | 'Collection'
> = `Error: ${T} ID cannot start with a dot '.'`
export type ErrorEmptyDocumentOrCollectionID<
	T extends 'Document' | 'Collection'
> = `Error: ${T} ID is empty`
export type ErrorNumberOfForwardSlashIsNotEqual<
	Value extends string,
	Type extends string
> = `Error: ${GetNumberOfPathSlash<Value> extends 0
	? `The type in need is ${Type}.${string extends Value
			? `Detected type is 'string', you seem to forget to assert your value as const, eg: ''a/b/c' as const'`
			: ''}`
	: `Invalid query, forward slash count mismatched`}, current count is ${GetNumberOfPathSlash<Value>}, need ${GetNumberOfPathSlash<Type>}.`
export type ErrorEmptyUpdate = `Error: Update data is an empty object literal`
export type ErrorPossiblyUndefinedAsArrayElement =
	`Error: You cannot assign PossiblyUndefined as array element, eg: 'PossiblyUndefined[]', you can however assign PossiblyUndefined anyway you want to array element, eg: < { a : number | PossiblyUndefined }[] >`
export type ErrorMoreThanOnceDocSnapshotInCursor =
	`Error: If cursors has a DocumentSnapshot(or QueryDocumentSnapshot) argument, then DocumentSnapshot(or QueryDocumentSnapshot) should be the one and only one argument`
export type ErrorLimitInvalidNumber =
	`Error: do not use negative, 0 or decimal value`
export type ErrorLimitToLastOrderBy = // ! sometime throw sometime doesn't, weird
	`Error: You must specify at least one orderBy clause for limitToLast queries`
export type ErrorWhereCompareValueMustBeArray<T extends string> =
	`Error: '${T}' is not an array, you can only use 'array-contains' and 'array-contains-any' on '${T}' if '${T}' is an array data type`
export type ErrorWhereOrderByAndInEquality<
	OrderByField extends string,
	WhereField extends string
> = `Error: Invalid query. You have a where filter with an inequality '<, <=, !=, not-in, >, or >=' on field '${WhereField &
	string}' and so you must also use '${WhereField &
	string}' as your first argument to orderBy(), but your first orderBy() is on field '${OrderByField &
	string}' instead.`
export type ErrorWhereNotIn =
	`Error:You can't combine 'not-in' with 'or', 'in', 'array-contains-any', or '!=' in the same query.`
export type ErrorWhereArrayContainsArrayContainsAny =
	`You can use at most one 'array-contains' or 'array-contains' clause per query. You can't combine 'array-contains' with 'array-contains-any.'`
export type ErrorWhereInequalityOpStrSameField =
	`Invalid query. All where filters with an inequality '<, <=, !=, not-in, >, or >=' must be on the same field path.`
export type ErrorWhereOnlyOneNotEqual =
	`Error: You cannot use more than one '!=' filter.(undocumented)`
export type ErrorWhereNoNeverEmptyArray =
	`Error: No Empty Array 'never[]' in 'in, not-in, array-contains-any' filter`
export type ErrorCursorTooManyArguments =
	`Error: Too many arguments provided to 'startAt/startAfter/endAt/endBefore'. The number of arguments must be less than or equal to the number of 'orderBy()' clauses than come before it`
export type ErrorUnknownMember<T> =
	`Error: The value might be incorrect or '${T &
		string}' is an unknown property`
export type ErrorWhereDocumentFieldPath =
	`If field path is document ID, then value must be string`
export type ErrorArrayFieldValueEmpty =
	`Error: arrayUnion and arrayRemove need at least 1 argument`
export type ErrorEmptyCursor = `Error: cursor need at least 1 argument.`
export type ErrorCursorNoArray =
	`Error: cursor rest parameter must be tuple type, not array type. Use const assertion to transform array type to tuple type`
export type ErrorAutoIdTypeMustBeWideString<T extends string> =
	`Error: Only document with wide 'string' type can generate auto id, the current type is literal type '${T}'`
export type ErrorWhereInOrNotInValueIsNotArray<T extends string> =
	`Error: The value provided to 'in' or 'not-in' comparator must be array of type '${T}'`
export type ErrorOrAndInvalidConstraints =
	`Error: 'or' & 'and' queries accept only 'where' clause and 'or' & 'and' queries`
export type ErrorInvalidTopLevelFilter =
	`Error: When using composite filters, you cannot use more than one filter('and' 'when' 'or') at the top level. Consider nesting the multiple filters within an 'and(...)' statement. For example: change 'query(query, where(...), or(...))' to 'query(query, and(where(...), or(...)))'.`
export type ErrorCannotUseNotInOrQuery = // ! only throw at runtime if 'or' has more than one clauses
	"Error: You cannot use 'not-in' in 'or' query, nested or not. But can be neighbor in 'and' query , eg: and(where('a','not-in',[1]), or(where('b','>',2), where('c','<',1)))"
export type ErrorEmptyCompositeFilter = 'Error: Your filter is empty'
export type ErrorColRefOrderByDocumentIDCursorNoSlash<T extends string> =
	`Error: When querying a collection and ordering by documentId(), the value passed to 'startAt/startAfter/endAt/endBefore' must be a plain document ID, but ${T} contains a slash.`
export type ErrorNonTopLevelDeleteField =
	`Error: In non-flatten operations, deleteField() must appear at top level`
export type ErrorDocIdIncorrectType =
	'Error: DocId must be single/multiple argument of string or CollectionReference'
export type ErrorOnSnapshotLastArg =
	'Error onSnapshot 4th argument must be empty if 3rd argument is { includeMetadataChanges: boolean }'
export type ErrorKeyNotExist<T extends string> =
	`Error: The key '${T}' does not exist`

export type ErrorMsgs =
	| ErrorUndefined
	| ErrorNullBanned
	| ErrorTypesBanned
	| ErrorDirectNested
	| ErrorFieldValueInArray
	| ErrorEmptyDocumentOrCollectionID<'Document' | 'Collection'>
	| ErrorUnassignedAbleFieldValue
	| ErrorDeleteFieldMerge
	| ErrorDeleteFieldUnion<string>
	| ErrorNumberOfForwardSlashIsNotEqual<string, string>
	| ErrorPleaseDoConstAssertion
	| ErrorEndOfID
	| ErrorCollectionIDString
	| ErrorInvalidDocumentOrCollectionID<'Document' | 'Collection', 'ID' | 'Path'>
	| ErrorInvalidDocumentOrCollectionIDStart<'Document' | 'Collection'>
	| ErrorEmptyUpdate
	| ErrorPossiblyUndefinedAsArrayElement
	| ErrorMoreThanOnceDocSnapshotInCursor
	| ErrorLimitInvalidNumber
	| ErrorLimitToLastOrderBy
	| ErrorWhereOrderByAndInEquality<string, string>
	| ErrorWhereCompareValueMustBeArray<string>
	| ErrorWhereNotIn
	| ErrorWhereArrayContainsArrayContainsAny
	| ErrorWhereInequalityOpStrSameField
	| ErrorWhereOnlyOneNotEqual
	| ErrorCursorTooManyArguments
	| ErrorUnknownMember<string>
	| ErrorWhereDocumentFieldPath
	| ErrorWhereNoNeverEmptyArray
	| ErrorArrayFieldValueEmpty
	| ErrorEmptyCursor
	| ErrorCursorNoArray
	| ErrorAutoIdTypeMustBeWideString<string>
	| ErrorWhereInOrNotInValueIsNotArray<string>
	| ErrorOrAndInvalidConstraints
	| ErrorInvalidTopLevelFilter
	| ErrorCannotUseNotInOrQuery
	| ErrorEmptyCompositeFilter
	| ErrorColRefOrderByDocumentIDCursorNoSlash<string>
	| ErrorNonTopLevelDeleteField
	| ErrorDocIdIncorrectType
	| ErrorOnSnapshotLastArg
	| ErrorKeyNotExist<string>

// unused
export type ReplaceErrorMsgsWithNever<T> = T extends ErrorMsgs ? never : T

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
