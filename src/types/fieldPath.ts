import { MetaType } from './metaTypeCreator'
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

export type AddSentinelFieldPathToCompare<T extends MetaType> = StrictOmit<
	T,
	'compare'
> & {
	compare: T['compare'] & {
		[K in __name__]: string | DocumentReference<T>
	}
}

export type AddSentinelFieldPathToCompareHighLevel<
	T extends MetaType,
	Q extends Query<T> | CollectionReference<T>
> = Q extends Query<T>
	? Query<AddSentinelFieldPathToCompare<T>>
	: Q extends CollectionReference<T>
	? CollectionReference<AddSentinelFieldPathToCompare<T>>
	: never // impossible route

export type RemoveSentinelFieldPathFromCompare<T extends MetaType> = StrictOmit<
	T,
	'compare'
> & {
	compare: StrictOmit<T['compare'], __name__>
}

export type __name__ = '__name__'

export type GetCorrectDocumentIdBasedOnRef<
	T extends MetaType,
	Q extends Query<T> | CollectionReference<T>,
	FieldPath extends keyof T['compare'],
	Value
> = FieldPath extends __name__
	? Value extends string
		? Q extends CollectionReference<T>
			? string extends Value
				? ErrorPleaseDoConstAssertion
				: Value extends T['docID']
				? IsValidID<Value, 'Document', 'ID'>
				: T['docID']
			: Q extends Query<T>
			? string extends Value
				? ErrorPleaseDoConstAssertion
				: GetNumberOfSlash<Value> extends GetNumberOfSlash<T['docPath']> // checking number of slash is a must, because the docID type most likely is string, and will accept any string
				? Value extends T['docPath']
					? IsValidID<Value, 'Document', 'Path'>
					: T['docPath']
				: ErrorNumberOfForwardSlashIsNotEqual<
						GetNumberOfSlash<T['docPath']>,
						GetNumberOfSlash<Value>
				  >
			: never // impossible route
		: DocumentReference<RemoveSentinelFieldPathFromCompare<T>>
	: FieldPath extends string
	? T['compare'][FieldPath]
	: never // impossible route
