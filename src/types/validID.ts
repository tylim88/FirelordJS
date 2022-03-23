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
export type GetNumberOfSlash<ID extends string> = GetNumberOfInvalidCharacter<
	ID,
	'/'
>

export type GetNumberOfInvalidCharacter<
	ID extends string,
	InvalidCharacter extends string,
	SlashCount extends unknown[] = []
> = ID extends `${infer Head}${InvalidCharacter}${infer Tail}`
	? GetNumberOfInvalidCharacter<Tail, InvalidCharacter, [1, ...SlashCount]>
	: SlashCount['length']

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
		: GetNumberOfInvalidCharacter<ID, AllowInvalidIDCharacter<Allow>> extends 0
		? ID
		: ErrorInvalidDocumentOrCollectionID<Mode>
	: NoUndefinedAndBannedTypes<ID, never>
