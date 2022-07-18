import { MetaType } from './metaTypeCreator'
import { DocumentReference, Transaction, WriteBatch } from './ref'

type DeleteCreator<U> = <T extends MetaType>(
	reference: DocumentReference<T>
) => U

export type Delete = DeleteCreator<Promise<void>>

export type WriteBatchDelete = DeleteCreator<WriteBatch>

export type TransactionDelete = DeleteCreator<Transaction>
