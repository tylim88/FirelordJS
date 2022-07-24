import { MetaType } from './metaTypeCreator'
import { DocumentReference } from './refs'
import {
	PartialNoUndefinedAndNoUnknownMemberNoEmptyMember,
	RecursivelyReplaceDeleteFieldWithErrorMsg,
} from './partialNoUndefinedAndNoUnknownMember'
import { DeepKeyHybrid } from './objectFlatten'
import { Transaction } from './transaction'
import { WriteBatch } from './batch'

type SetCreator<U> = <
	T extends MetaType,
	// https://stackoverflow.com/questions/71223634/typescript-interface-causing-type-instantiation-is-excessively-deep-and-possibl
	Data extends Record<string, unknown>,
	SetOptions extends
		| {
				merge: boolean
		  }
		| {
				mergeFields: DeepKeyHybrid<Data, 'write'>[]
		  }
		| undefined = undefined
>(
	reference: DocumentReference<T>,
	data: Data extends never
		? Data
		: SetOptions extends
				| {
						merge: true
				  }
				| {
						mergeFields: DeepKeyHybrid<Data, 'write'>[]
				  }
		? PartialNoUndefinedAndNoUnknownMemberNoEmptyMember<
				T['write'],
				Data,
				SetOptions extends { merge: boolean }
					? SetOptions['merge']
					: SetOptions extends { mergeFields: DeepKeyHybrid<Data, 'write'>[] }
					? SetOptions['mergeFields']
					: false,
				false
		  >
		: RecursivelyReplaceDeleteFieldWithErrorMsg<T['write'], Data>,
	options?: SetOptions extends never ? SetOptions : SetOptions
) => U

export type Set = SetCreator<Promise<void>>

export type TransactionSet = SetCreator<Transaction>

export type WriteBatchSet = SetCreator<WriteBatch>
