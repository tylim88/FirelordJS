import { PartialNoUndefinedAndNoUnknownMemberNoEmptyMember } from './partialNoUndefinedAndNoUnknownMember'
import { DocumentReference } from './refs'
import { DocumentData } from './alias'
import { Transaction } from './transaction'
import { WriteBatch } from './batch'
import { MetaType } from './metaTypeCreator'

export type UpdateCreator<U> = <T extends MetaType, Data extends DocumentData>(
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
