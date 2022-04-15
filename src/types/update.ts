import {
	MetaType,
	DocumentReference,
	PartialNoUndefinedAndNoUnknownMemberNoEmptyMember,
} from '../types'
import { Transaction, WriteBatch } from './ref'
/**
	Updates fields in the document referred to by the specified DocumentReference. The update will fail if applied to a document that does not exist.

	@param reference — A reference to the document to update.
	
	@param data
	An object containing the fields and values with which to update the document. Fields can contain dots to reference nested fields within the document.
	
	@returns
	A Promise resolved once the data has been successfully written to the backend (note that it won't resolve while you're offline). 
*/
export type UpdateCreator<U> = <
	T extends MetaType,
	Data extends import('@firebase/firestore').DocumentData
>(
	reference: DocumentReference<T>,
	data: Data extends never
		? Data
		: PartialNoUndefinedAndNoUnknownMemberNoEmptyMember<
				T['writeFlatten'],
				Data,
				false,
				false
		  >
) => U

export type Update = UpdateCreator<Promise<void>>

export type TransactionUpdate = UpdateCreator<Transaction>

export type WriteBatchUpdate = UpdateCreator<WriteBatch>
