import { MetaType } from './metaTypeCreator'
import { IsEqual } from './utils'
import {
	DocumentReference,
	Query,
	CollectionReference,
	GeneralQuery,
	CollectionGroup,
} from './refs'
import { IsValidID, GetNumberOfPathSlash } from './validID'
import {
	ErrorNumberOfForwardSlashIsNotEqual,
	ErrorPleaseDoConstAssertion,
} from './error'
import { DeepValue } from './objectFlatten'

export type __name__ = '__name__'
export type __name__Record = Record<__name__, unknown>

export type GetCorrectDocumentIdBasedOnRef<
	T extends MetaType,
	Q extends GeneralQuery<T>,
	FieldPath extends keyof T['compare'],
	Value
> = FieldPath extends __name__
	? Value extends string
		? true extends IsEqual<CollectionReference<T>, Q>
			? string extends T['docID']
				? IsValidID<Value, 'Document', 'ID'>
				: string extends Value
				? ErrorPleaseDoConstAssertion
				: Value extends T['docID']
				? IsValidID<Value, 'Document', 'ID'>
				: T['docID']
			: true extends IsEqual<Query<T>, Q> | IsEqual<CollectionGroup<T>, Q>
			? string extends Value
				? ErrorPleaseDoConstAssertion
				: GetNumberOfPathSlash<Value> extends GetNumberOfPathSlash<T['docPath']> // checking number of slash is a must, because the docID type most likely is string, and will accept any string
				? Value extends T['docPath']
					? IsValidID<Value, 'Document', 'Path'>
					: T['docPath']
				: ErrorNumberOfForwardSlashIsNotEqual<Value, T['docPath']>
			: never // impossible route
		: DocumentReference<T>
	: FieldPath extends string
	? DeepValue<T['compare'], FieldPath>
	: never // impossible route
