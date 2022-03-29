import { MetaType } from './metaTypeCreator'
import { DocumentReference, Transaction, WriteBatch } from './ref'
import {
	PartialNoUndefinedAndNoUnknownMember,
	RecursivelyReplaceDeleteFieldWithErrorMsg,
} from './partialNoUndefinedAndNoUnknownMember'
import { DeepKeyHybrid } from './objectFlatten'

/**
Writes to the document referred to by this DocumentReference. If the document does not yet exist, it will be created.

@param reference — A reference to the document to write.

@param data — A map of the fields and values for the document.

@param options - An object to configure the set behavior.

@returns
A Promise resolved once the data has been successfully written to the backend (note that it won't resolve while you're offline).
*/
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
		? PartialNoUndefinedAndNoUnknownMember<
				T['write'],
				Data,
				SetOptions extends { merge: boolean }
					? SetOptions['merge']
					: SetOptions extends { mergeFields: DeepKeyHybrid<Data, 'write'>[] }
					? SetOptions['mergeFields']
					: false,
				true
		  >
		: RecursivelyReplaceDeleteFieldWithErrorMsg<T['write'], Data>,
	options?: SetOptions extends never ? SetOptions : SetOptions
) => U

export type Set = SetCreator<Promise<void>>

export type TransactionSet = SetCreator<Transaction>

export type WriteBatchSet = SetCreator<WriteBatch>
