import { MetaType } from './metaTypeCreator'
import { StrictOmit, IsEqual } from './utils'
import { DocumentReference, Query, CollectionReference } from './refs'
import { IsValidID, GetNumberOfSlash } from './validID'
import {
	ErrorNumberOfForwardSlashIsNotEqual,
	ErrorPleaseDoConstAssertion,
} from './error'
import { DocumentIdSymbol } from './unique'
export interface DocumentId {
	'Firelord.FieldPath': DocumentIdSymbol
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
> = IsEqual<Query<AddSentinelFieldPathToCompare<T>>, Q> extends true
	? Query<AddSentinelFieldPathToCompare<T>>
	: IsEqual<CollectionReference<T>, Q> extends true
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
		? IsEqual<CollectionReference<T>, Q> extends true
			? string extends Value
				? ErrorPleaseDoConstAssertion
				: Value extends T['docID']
				? IsValidID<Value, 'Document', 'ID'>
				: T['docID']
			: IsEqual<Query<AddSentinelFieldPathToCompare<T>>, Q> extends true
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
