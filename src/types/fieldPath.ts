import { MetaTypes } from './metaTypeCreator'
import { StrictOmit } from './utils'
import { DocumentReference, Query, CollectionReference } from './ref'
import { IsValidID, GetNumberOfSlash } from './validID'
import {
	ErrorNumberOfForwardSlashIsNotEqual,
	ErrorPleaseDoConstAssertion,
} from './error'
export interface DocumentId {
	'Firelord.FieldPath': 'DocumentId'
}

export type AddSentinelFieldPathToCompare<T extends MetaTypes> = StrictOmit<
	T,
	'compare'
> & {
	compare: T['compare'] & {
		[K in __name__]: string | DocumentReference<T>
	}
}

export type RemoveSentinelFieldPathFromCompare<T extends MetaTypes> =
	StrictOmit<T, 'compare'> & {
		compare: StrictOmit<T['compare'], __name__>
	}

export type __name__ = '__name__'

export type GetCorrectDocumentIdBasedOnRef<
	T extends MetaTypes,
	FieldPath extends keyof T['compare'],
	Value,
	Q extends Query<T> | CollectionReference<T>
> = FieldPath extends __name__
	? Value extends string
		? Q extends CollectionReference<T>
			? string extends Value
				? ErrorPleaseDoConstAssertion
				: IsValidID<Value, 'Document'>
			: GetNumberOfSlash<Value> extends GetNumberOfSlash<T['docPath']>
			? Value extends T['docPath']
				? IsValidID<Value, 'Document'>
				: T['docPath']
			: ErrorNumberOfForwardSlashIsNotEqual<
					GetNumberOfSlash<T['docPath']>,
					GetNumberOfSlash<Value>
			  >
		: DocumentReference<RemoveSentinelFieldPathFromCompare<T>>
	: T['compare'][FieldPath]
