import {
	MetaType,
	DocumentReference,
	PartialNoUndefinedAndNoUnknownMemberNoEmptyMember,
} from '../types'
import { Transaction } from './transaction'
import { WriteBatch } from './WriteBatch'

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
