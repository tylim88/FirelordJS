import {
	ErrorEmptyDocumentOrCollectionID,
	NoUndefinedAndBannedTypes,
	ErrorInvalidDocumentOrCollectionIDStart,
	ErrorInvalidDocumentOrCollectionID,
	ErrorEndOfID,
} from './error'

type InvalidIDCharacter = '/' | '..' | '//' | '__'
type AllowInvalidIDCharacter<S extends InvalidIDCharacter> = Exclude<
	InvalidIDCharacter,
	S
>
export type GetNumberOfPathSlash<ID extends string> =
	GetNumberOfInvalidCharacter<ID, '/'>

export type GetNumberOfInvalidCharacter<
	ID extends string,
	InvalidCharacter extends string,
	SlashCount extends unknown[] = []
> = ID extends `${string}${InvalidCharacter}${infer Tail}`
	? GetNumberOfInvalidCharacter<Tail, InvalidCharacter, [1, ...SlashCount]>
	: SlashCount['length']

export type IsValidID<
	ID extends string,
	Mode extends 'Document' | 'Collection',
	Type extends 'ID' | 'Path'
> = ID extends NoUndefinedAndBannedTypes<ID, never>
	? ID extends ''
		? ErrorEmptyDocumentOrCollectionID<Mode>
		: ID extends `${string}/`
		? ErrorEndOfID
		: ID extends `.${string}`
		? ErrorInvalidDocumentOrCollectionIDStart<Mode>
		: GetNumberOfInvalidCharacter<
				ID,
				AllowInvalidIDCharacter<
					Type extends 'ID' ? never : Type extends 'Path' ? '/' : never // impossible route
				>
		  > extends 0
		? ID extends `${string}__${string}`
			? ErrorInvalidDocumentOrCollectionID<Mode, Type>
			: ID
		: ErrorInvalidDocumentOrCollectionID<Mode, Type>
	: NoUndefinedAndBannedTypes<ID, never>

export type IsValidDocIDLoop<
	D extends string[],
	ACC extends string[] = []
> = D extends [infer R extends string, ...infer H extends string[]]
	? IsValidDocIDLoop<H, [...ACC, IsValidID<R, 'Document', 'ID'>]>
	: ACC
