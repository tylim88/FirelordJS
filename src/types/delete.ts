import { MetaTypes } from './creator'
import { DocumentReference, Transaction, WriteBatch } from './ref'
/**
Deletes the document referred to by the specified DocumentReference.

@param reference — A reference to the document to delete.

@returns
A Promise resolved once the document has been successfully deleted from the backend (note that it won't resolve while you're offline).
*/
type DeleteCreator<U> = <T extends MetaTypes>(
	reference: DocumentReference<T>
) => U

export type Delete = DeleteCreator<Promise<void>>

export type WriteBatchDelete = DeleteCreator<WriteBatch>

export type TransactionDelete = DeleteCreator<Transaction>
