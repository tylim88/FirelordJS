import {
	PartialNoImplicitUndefinedAndNoExtraMember,
	Firelord,
} from './firelord'
import { FirelordFirestore } from './firelordFirestore'
import { createTime } from './utils'

export const docSnapshotCreator = <
	T extends Firelord.MetaType,
	M extends 'col' | 'colGroup' = 'col'
>(
	firestore: FirelordFirestore.Firestore,
	colRef: M extends 'col'
		? FirelordFirestore.CollectionReference
		: M extends 'colGroup'
		? undefined
		: never,
	documentSnapshot: FirelordFirestore.DocumentSnapshot
): ReturnType<DocSnapshotCreator<T, M>> => {
	type Read = Firelord.InternalReadWriteConverter<T>['read']

	return {
		exists: documentSnapshot.exists,
		id: documentSnapshot.id,
		ref: docCreator<T, M>(
			firestore,
			colRef,
			documentSnapshot.ref
		)(documentSnapshot.ref.id),
		data: () => {
			return documentSnapshot.data() as T['read'] | undefined
		},
		get: <F extends string & keyof T['write']>(fieldPath: F) => {
			return documentSnapshot.get(fieldPath) as Read[F]
		},
		isEqual: (other: FirelordFirestore.DocumentSnapshot) => {
			return documentSnapshot.isEqual(
				other as FirelordFirestore.DocumentSnapshot<Read>
			)
		},
	}
}

export type DocSnapshotCreator<
	T extends Firelord.MetaType,
	M extends 'col' | 'colGroup' = 'col'
> = (
	firestore: FirelordFirestore.Firestore,
	colRef: M extends 'col'
		? FirelordFirestore.CollectionReference
		: M extends 'colGroup'
		? undefined
		: never,
	documentSnapshot: FirelordFirestore.DocumentSnapshot
) => {
	exists: boolean
	id: string
	ref: ReturnType<ReturnType<DocCreator<T, M>>>
	data: () => T['read'] | undefined
	get: <F extends string & keyof T['write']>(fieldPath: F) => T['read'][F]
	isEqual: (other: FirelordFirestore.DocumentSnapshot) => boolean
}

export const docCreator =
	<T extends Firelord.MetaType, M extends 'col' | 'colGroup' = 'col'>(
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
	(documentID?: T['docID']): ReturnType<ReturnType<DocCreator<T, M>>> => {
		type Write = Firelord.InternalReadWriteConverter<T>['write']
		type WriteNested = Firelord.InternalReadWriteConverter<T>['writeNested']
		type Read = Firelord.InternalReadWriteConverter<T>['read']

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
					next?: (snapshot: ReturnType<DocSnapshotCreator<T, M>>) => void
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
			update: <J extends Partial<Write>>(
				data: J extends never
					? J
					: PartialNoImplicitUndefinedAndNoExtraMember<Write, J>
			) => {
				return docWrite.update({
					...updatedAt,
					...data,
				})
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
						return batch.update(docWrite, { ...updatedAt, ...data })
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
						return transaction.update(docWrite, { ...updatedAt, ...data })
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
	T extends Firelord.MetaType,
	M extends 'col' | 'colGroup' = 'col'
> = (
	firestore: FirelordFirestore.Firestore,
	colRef: M extends 'col'
		? FirelordFirestore.CollectionReference
		: M extends 'colGroup'
		? undefined
		: never,
	docRef:
		| FirelordFirestore.DocumentReference
		| (M extends 'col' ? undefined : M extends 'colGroup' ? never : never)
) => (documentID?: T['docID']) => {
	firestore: FirelordFirestore.FirebaseFirestore
	id: string
	parent: FirelordFirestore.CollectionReference<T['read']>
	path: string
	isEqual: (
		other: FirelordFirestore.DocumentReference<FirelordFirestore.DocumentData>
	) => boolean
	onSnapshot: (
		observer: {
			next?: (snapshot: ReturnType<DocSnapshotCreator<T, M>>) => void
			error?: (error: Error) => void
		},
		options?: FirelordFirestore.SnapshotListenOptions
	) => () => void
	set: <
		J_1 extends Partial<Firelord.InternalReadWriteConverter<T>['writeNested']>,
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
			? Firelord.InternalReadWriteConverter<T>['writeNested']
			: Z['merge'] extends true
			? PartialNoImplicitUndefinedAndNoExtraMember<
					Firelord.InternalReadWriteConverter<T>['writeNested'],
					J_1
			  >
			: Z['mergeField'] extends Exclude<
					keyof T['write'],
					'createdAt' | 'updatedAt'
			  >[]
			? PartialNoImplicitUndefinedAndNoExtraMember<
					Firelord.InternalReadWriteConverter<T>['writeNested'],
					J_1
			  >
			: Firelord.InternalReadWriteConverter<T>['writeNested'],
		options?: Z | undefined
	) => Promise<void>
	update: <
		J_2 extends Partial<Firelord.InternalReadWriteConverter<T>['write']>
	>(
		data: J_2 extends never
			? J_2
			: PartialNoImplicitUndefinedAndNoExtraMember<
					Firelord.InternalReadWriteConverter<T>['write'],
					J_2
			  >
	) => Promise<void>
	get: (
		options?: FirelordFirestore.GetOptions
	) => Promise<ReturnType<DocSnapshotCreator<T, M>>>
	delete: () => Promise<void>
	batch: (batch: FirelordFirestore.WriteBatch) => {
		commit: () => Promise<void>
		delete: () => FirelordFirestore.WriteBatch
		update: <
			J_3 extends Partial<Firelord.InternalReadWriteConverter<T>['write']>
		>(
			data: J_3 extends never
				? J_3
				: PartialNoImplicitUndefinedAndNoExtraMember<
						Firelord.InternalReadWriteConverter<T>['write'],
						J_3
				  >
		) => FirelordFirestore.WriteBatch
		set: <
			J_7 extends Partial<
				Firelord.InternalReadWriteConverter<T>['writeNested']
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
				? Firelord.InternalReadWriteConverter<T>['writeNested']
				: Z_2['merge'] extends true
				? PartialNoImplicitUndefinedAndNoExtraMember<
						Firelord.InternalReadWriteConverter<T>['writeNested'],
						J_7
				  >
				: Z_2['mergeField'] extends Exclude<
						keyof T['write'],
						'createdAt' | 'updatedAt'
				  >[]
				? PartialNoImplicitUndefinedAndNoExtraMember<
						Firelord.InternalReadWriteConverter<T>['writeNested'],
						J_7
				  >
				: Firelord.InternalReadWriteConverter<T>['writeNested'],
			options?: Z_2 | undefined
		) => FirelordFirestore.WriteBatch
	}
	transaction: (transaction: FirelordFirestore.Transaction) => {
		set: <
			J_4 extends Partial<
				Firelord.InternalReadWriteConverter<T>['writeNested']
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
				? Firelord.InternalReadWriteConverter<T>['writeNested']
				: Z_1['merge'] extends true
				? PartialNoImplicitUndefinedAndNoExtraMember<
						Firelord.InternalReadWriteConverter<T>['writeNested'],
						J_4
				  >
				: Z_1['mergeField'] extends Exclude<
						keyof T['write'],
						'createdAt' | 'updatedAt'
				  >[]
				? PartialNoImplicitUndefinedAndNoExtraMember<
						Firelord.InternalReadWriteConverter<T>['writeNested'],
						J_4
				  >
				: Firelord.InternalReadWriteConverter<T>['writeNested'],
			options?: Z_1 | undefined
		) => FirelordFirestore.Transaction
		update: <
			J_5 extends Partial<Firelord.InternalReadWriteConverter<T>['write']>
		>(
			data: J_5 extends never
				? J_5
				: PartialNoImplicitUndefinedAndNoExtraMember<
						Firelord.InternalReadWriteConverter<T>['write'],
						J_5
				  >
		) => FirelordFirestore.Transaction
		delete: () => FirelordFirestore.Transaction
		get: () => Promise<ReturnType<DocSnapshotCreator<T, M>>>
	}
}
