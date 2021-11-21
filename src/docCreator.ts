import {
	PartialNoImplicitUndefinedAndNoExtraMember,
	FirelordUtils,
} from './firelordUtils'
import { FirelordFirestore } from './firelordFirestore'
import { createTime } from './utils'
import { docSnapshotCreator, DocSnapshotCreator } from './docSnapshotCreator'

export const docCreator: <
	T extends FirelordUtils.MetaType,
	M extends 'col' | 'colGroup' = 'col'
>(
	firestore: FirelordFirestore.Firestore,
	colRef: M extends 'col'
		? FirelordFirestore.CollectionReference
		: M extends 'colGroup'
		? undefined
		: never,
	docRef:
		| FirelordFirestore.DocumentReference
		| (M extends 'col' ? undefined : M extends 'colGroup' ? never : never)
) => DocCreator<T, M> =
	<T extends FirelordUtils.MetaType, M extends 'col' | 'colGroup' = 'col'>(
		firestore: FirelordFirestore.Firestore,
		colRef: M extends 'col'
			? FirelordFirestore.CollectionReference
			: M extends 'colGroup'
			? undefined
			: never,
		docRef:
			| FirelordFirestore.DocumentReference
			| (M extends 'col' ? undefined : M extends 'colGroup' ? never : never)
	) =>
	(documentID?: T['docID']): ReturnType<DocCreator<T, M>> => {
		type Write = FirelordUtils.InternalReadWriteConverter<T>['write']
		type WriteNested =
			FirelordUtils.InternalReadWriteConverter<T>['writeNested']
		type Read = FirelordUtils.InternalReadWriteConverter<T>['read']

		const { updatedAt } = createTime(firestore)

		// undefined type is here but we already make sure that it is impossible for undefined to reach here
		// if docRef is undefined, colRef will not be undefined and vice versa
		const docRef_ =
			docRef ||
			((colRef &&
				(documentID
					? colRef.doc(documentID)
					: colRef.doc())) as FirelordFirestore.DocumentReference)

		const docWrite = docRef_ as FirelordFirestore.DocumentReference<Write>

		const docRead = docRef_ as FirelordFirestore.DocumentReference<Read>

		return {
			firestore: docRead.firestore,
			id: docRead.id,
			parent: docRead.parent,
			path: docRead.path,
			isEqual: (other: FirelordFirestore.DocumentReference) => {
				return docRead.isEqual(
					other as FirelordFirestore.DocumentReference<Read>
				)
			},
			onSnapshot: (
				observer: {
					next?: (snapshot: DocSnapshotCreator<T, M>) => void
					error?: (error: Error) => void
				},
				options?: FirelordFirestore.SnapshotListenOptions
			) => {
				return docRead.onSnapshot(
					options || { includeMetadataChanges: false },
					{
						next: documentSnapshot => {
							return (
								observer.next &&
								observer.next(
									docSnapshotCreator<T, M>(firestore, colRef, documentSnapshot)
								)
							)
						},
						error: err => {
							return observer.error && observer.error(err)
						},
					}
				)
			},
			set: <
				J extends Partial<WriteNested>,
				Z extends { merge?: true; mergeField?: (keyof Write)[] }
			>(
				data: J extends never
					? J
					: Z extends undefined
					? WriteNested
					: Z['merge'] extends true
					? PartialNoImplicitUndefinedAndNoExtraMember<WriteNested, J>
					: Z['mergeField'] extends (keyof Write)[]
					? PartialNoImplicitUndefinedAndNoExtraMember<WriteNested, J>
					: WriteNested,
				options?: Z
			) => {
				return docWrite.set(data, options || {})
			},
			update: async <J extends Partial<Write>>(
				data: J extends never
					? J
					: PartialNoImplicitUndefinedAndNoExtraMember<Write, J>
			) => {
				return Object.keys(data).length > 0
					? docWrite.update({
							...updatedAt,
							...data,
					  })
					: undefined
			},
			get: (options?: FirelordFirestore.GetOptions) => {
				return docRead.get(options).then(documentSnapshot => {
					return docSnapshotCreator<T, M>(firestore, colRef, documentSnapshot)
				})
			},
			delete: () => docWrite.delete(),
			batch: (batch: FirelordFirestore.WriteBatch) => {
				return {
					commit: () => {
						return batch.commit()
					},
					delete: () => {
						return batch.delete(docWrite)
					},
					update: <J extends Partial<Write>>(
						data: J extends never
							? J
							: PartialNoImplicitUndefinedAndNoExtraMember<Write, J>
					) => {
						return (
							Object.keys(data).length > 0
								? batch.update(docWrite, { ...updatedAt, ...data })
								: undefined
						) as J extends Record<string, never>
							? undefined
							: FirelordFirestore.WriteBatch
					},
					set: <
						J extends Partial<WriteNested>,
						Z extends { merge?: true; mergeField?: (keyof Write)[] }
					>(
						data: J extends never
							? J
							: Z extends undefined
							? WriteNested
							: Z['merge'] extends true
							? PartialNoImplicitUndefinedAndNoExtraMember<WriteNested, J>
							: Z['mergeField'] extends (keyof Write)[]
							? PartialNoImplicitUndefinedAndNoExtraMember<WriteNested, J>
							: WriteNested,
						options?: Z
					) => {
						return batch.set(docWrite, data, options || {})
					},
				}
			},
			transaction: (transaction: FirelordFirestore.Transaction) => {
				return {
					set: <
						J extends Partial<WriteNested>,
						Z extends { merge?: true; mergeField?: (keyof Write)[] }
					>(
						data: J extends never
							? J
							: Z extends undefined
							? WriteNested
							: Z['merge'] extends true
							? PartialNoImplicitUndefinedAndNoExtraMember<WriteNested, J>
							: Z['mergeField'] extends (keyof Write)[]
							? PartialNoImplicitUndefinedAndNoExtraMember<WriteNested, J>
							: WriteNested,
						options?: Z
					) => {
						return transaction.set(docWrite, data, options || {})
					},
					update: <J extends Partial<Write>>(
						data: J extends never
							? J
							: PartialNoImplicitUndefinedAndNoExtraMember<Write, J>
					) => {
						return (
							Object.keys(data).length > 0
								? transaction.update(docWrite, { ...updatedAt, ...data })
								: undefined
						) as J extends Record<string, never>
							? undefined
							: FirelordFirestore.Transaction
					},
					delete: () => {
						return transaction.delete(docWrite)
					},
					get: () => {
						return transaction.get(docRead).then(documentSnapshot => {
							return docSnapshotCreator<T, M>(
								firestore,
								colRef,
								documentSnapshot
							)
						})
					},
				}
			},
		}
	}

export type DocCreator<
	T extends FirelordUtils.MetaType,
	M extends 'col' | 'colGroup' = 'col'
> = (documentID?: T['docID']) => {
	firestore: FirelordFirestore.FirebaseFirestore
	id: string
	parent: FirelordFirestore.CollectionReference<T['read']>
	path: string
	isEqual: (
		other: FirelordFirestore.DocumentReference<FirelordFirestore.DocumentData>
	) => boolean
	onSnapshot: (
		observer: {
			next?: (snapshot: DocSnapshotCreator<T, M>) => void
			error?: (error: Error) => void
		},
		options?: FirelordFirestore.SnapshotListenOptions
	) => () => void
	set: <
		J_1 extends Partial<
			FirelordUtils.InternalReadWriteConverter<T>['writeNested']
		>,
		Z extends {
			merge?: true | undefined
			mergeField?:
				| Exclude<keyof T['write'], 'createdAt' | 'updatedAt'>[]
				| undefined
		}
	>(
		data: J_1 extends never
			? J_1
			: Z extends undefined
			? FirelordUtils.InternalReadWriteConverter<T>['writeNested']
			: Z['merge'] extends true
			? PartialNoImplicitUndefinedAndNoExtraMember<
					FirelordUtils.InternalReadWriteConverter<T>['writeNested'],
					J_1
			  >
			: Z['mergeField'] extends Exclude<
					keyof T['write'],
					'createdAt' | 'updatedAt'
			  >[]
			? PartialNoImplicitUndefinedAndNoExtraMember<
					FirelordUtils.InternalReadWriteConverter<T>['writeNested'],
					J_1
			  >
			: FirelordUtils.InternalReadWriteConverter<T>['writeNested'],
		options?: Z | undefined
	) => Promise<void>
	update: <
		J_2 extends Partial<FirelordUtils.InternalReadWriteConverter<T>['write']>
	>(
		data: J_2 extends never
			? J_2
			: PartialNoImplicitUndefinedAndNoExtraMember<
					FirelordUtils.InternalReadWriteConverter<T>['write'],
					J_2
			  >
	) => Promise<void>
	get: (
		options?: FirelordFirestore.GetOptions
	) => Promise<DocSnapshotCreator<T, M>>
	delete: () => Promise<void>
	batch: (batch: FirelordFirestore.WriteBatch) => {
		commit: () => Promise<void>
		delete: () => FirelordFirestore.WriteBatch
		update: <
			J_3 extends Partial<FirelordUtils.InternalReadWriteConverter<T>['write']>
		>(
			data: J_3 extends never
				? J_3
				: PartialNoImplicitUndefinedAndNoExtraMember<
						FirelordUtils.InternalReadWriteConverter<T>['write'],
						J_3
				  >
		) => J_3 extends Record<string, never>
			? undefined
			: FirelordFirestore.WriteBatch
		set: <
			J_7 extends Partial<
				FirelordUtils.InternalReadWriteConverter<T>['writeNested']
			>,
			Z_2 extends {
				merge?: true | undefined
				mergeField?:
					| Exclude<keyof T['write'], 'createdAt' | 'updatedAt'>[]
					| undefined
			}
		>(
			data: J_7 extends never
				? J_7
				: Z_2 extends undefined
				? FirelordUtils.InternalReadWriteConverter<T>['writeNested']
				: Z_2['merge'] extends true
				? PartialNoImplicitUndefinedAndNoExtraMember<
						FirelordUtils.InternalReadWriteConverter<T>['writeNested'],
						J_7
				  >
				: Z_2['mergeField'] extends Exclude<
						keyof T['write'],
						'createdAt' | 'updatedAt'
				  >[]
				? PartialNoImplicitUndefinedAndNoExtraMember<
						FirelordUtils.InternalReadWriteConverter<T>['writeNested'],
						J_7
				  >
				: FirelordUtils.InternalReadWriteConverter<T>['writeNested'],
			options?: Z_2 | undefined
		) => FirelordFirestore.WriteBatch
	}
	transaction: (transaction: FirelordFirestore.Transaction) => {
		set: <
			J_4 extends Partial<
				FirelordUtils.InternalReadWriteConverter<T>['writeNested']
			>,
			Z_1 extends {
				merge?: true | undefined
				mergeField?:
					| Exclude<keyof T['write'], 'createdAt' | 'updatedAt'>[]
					| undefined
			}
		>(
			data: J_4 extends never
				? J_4
				: Z_1 extends undefined
				? FirelordUtils.InternalReadWriteConverter<T>['writeNested']
				: Z_1['merge'] extends true
				? PartialNoImplicitUndefinedAndNoExtraMember<
						FirelordUtils.InternalReadWriteConverter<T>['writeNested'],
						J_4
				  >
				: Z_1['mergeField'] extends Exclude<
						keyof T['write'],
						'createdAt' | 'updatedAt'
				  >[]
				? PartialNoImplicitUndefinedAndNoExtraMember<
						FirelordUtils.InternalReadWriteConverter<T>['writeNested'],
						J_4
				  >
				: FirelordUtils.InternalReadWriteConverter<T>['writeNested'],
			options?: Z_1 | undefined
		) => FirelordFirestore.Transaction
		update: <
			J_5 extends Partial<FirelordUtils.InternalReadWriteConverter<T>['write']>
		>(
			data: J_5 extends never
				? J_5
				: PartialNoImplicitUndefinedAndNoExtraMember<
						FirelordUtils.InternalReadWriteConverter<T>['write'],
						J_5
				  >
		) => J_5 extends Record<string, never>
			? undefined
			: FirelordFirestore.Transaction
		delete: () => FirelordFirestore.Transaction
		get: () => Promise<DocSnapshotCreator<T, M>>
	}
}
