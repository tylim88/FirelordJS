import {
	ErrorEmptyDocumentOrCollectionID,
	NoUndefinedAndBannedTypes,
	ErrorInvalidDocumentOrCollectionIDStart,
	ErrorInvalidDocumentOrCollectionID,
} from './error'

type InvalidIDCharacter = '/' | '..' | '//' | '__'
type AllowInvalidIDCharacter<S extends InvalidIDCharacter> = Exclude<
	InvalidIDCharacter,
	S
>
// ID type check is overkill, just for fun
export type IsValidID<
	ID extends string,
	Mode extends 'Document' | 'Collection',
	Allow extends InvalidIDCharacter = never
> = ID extends NoUndefinedAndBannedTypes<ID, never>
	? ID extends ''
		? ErrorEmptyDocumentOrCollectionID<Mode>
		: ID extends `.${infer Rest}`
		? ErrorInvalidDocumentOrCollectionIDStart<Mode>
		: ID extends `.${infer P}`
		? ErrorInvalidDocumentOrCollectionIDStart<Mode>
		: ID extends `${infer Head}${infer Middle}${infer Tail}`
		? Head extends AllowInvalidIDCharacter<Allow>
			? ErrorInvalidDocumentOrCollectionID<Mode>
			: Middle extends AllowInvalidIDCharacter<Allow>
			? ErrorInvalidDocumentOrCollectionID<Mode>
			: Tail extends AllowInvalidIDCharacter<Allow>
			? ErrorInvalidDocumentOrCollectionID<Mode>
			: ID
		: ID extends `${infer Head}${infer Tail}`
		? Head extends AllowInvalidIDCharacter<Allow>
			? ErrorInvalidDocumentOrCollectionID<Mode>
			: Tail extends AllowInvalidIDCharacter<Allow>
			? ErrorInvalidDocumentOrCollectionID<Mode>
			: ID
		: ID extends `${infer Head}`
		? Head extends AllowInvalidIDCharacter<Allow>
			? ErrorInvalidDocumentOrCollectionID<Mode>
			: ID
		: ID
	: NoUndefinedAndBannedTypes<ID, never>

export type GetNumberOfSlash<
	ID extends string,
	SlashCount extends unknown[] = []
> = ID extends `${infer Head}/${infer Tail}`
	? GetNumberOfSlash<Tail, [1, ...SlashCount]>
	: SlashCount['length']
