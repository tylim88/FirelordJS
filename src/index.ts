import {
	OmitKeys,
	PartialNoImplicitUndefined,
	ExcludePropertyKeys,
	RemoveArray,
} from './firelord'
import { FirelordFirestore } from './firelordFirestore'

export const firelord =
	(firestore: FirelordFirestore.Firestore) =>
	<
		T extends {
			colPath: string
			docPath: string
			read: FirelordFirestore.DocumentData &
				FirelordFirestore.CreatedUpdatedRead
			write: FirelordFirestore.DocumentData &
				FirelordFirestore.CreatedUpdatedWrite
			compare: FirelordFirestore.DocumentData &
				FirelordFirestore.CreatedUpdatedCompare
			base: FirelordFirestore.DocumentData
		} = never
	>() => {
		type Write = OmitKeys<T['write'], 'updatedAt' | 'createdAt'>
		type Read = T['read']
		type Compare = T['compare']
		type RemoveArrayTypeMember = ExcludePropertyKeys<Compare, unknown[]>
		const time = firestore.FieldValue.serverTimestamp()

		const newTime = {
			createdAt: time,
			updatedAt: new Date(0),
		}

		const queryCreator = (
			colRefRead:
				| FirelordFirestore.CollectionReference<Read>
				| FirelordFirestore.CollectionGroup<Read>,
			query?: FirelordFirestore.Query<Read>
		) => {
			const orderByCreator =
				(
					colRefRead:
						| FirelordFirestore.CollectionReference<Read>
						| FirelordFirestore.CollectionGroup<Read>,
					query?: FirelordFirestore.Query<Read>
				) =>
				<P extends RemoveArrayTypeMember>(
					fieldPath: P,
					directionStr: FirelordFirestore.OrderByDirection = 'asc',
					cursor?: {
						clause: 'startAt' | 'startAfter' | 'endAt' | 'endBefore'
						fieldValue: Compare[P] | FirelordFirestore.DocumentSnapshot
					}
				) => {
					const ref = (query || colRefRead).orderBy(fieldPath, directionStr)

					return queryCreator(
						colRefRead,
						cursor ? ref[cursor.clause](cursor.fieldValue) : ref
					)
				}

			return {
				where: <
					P extends string & keyof Read,
					J extends FirelordFirestore.WhereFilterOp,
					Q extends RemoveArrayTypeMember
				>(
					fieldPath: P,
					opStr: J extends never
						? J
						: Compare[P] extends unknown[]
						? 'array-contains' | 'in' | 'array-contains-any'
						: '<' | '<=' | '>=' | '>' | '==' | '!=' | 'not-in' | 'in',
					value: J extends 'not-in' | 'in'
						? Compare[P][]
						: J extends 'array-contains'
						? RemoveArray<Compare[P]>
						: Compare[P],
					orderBy?: J extends
						| '<'
						| '<='
						| '>='
						| '>'
						| '=='
						| 'in'
						| '!='
						| 'not-in'
						? P extends RemoveArrayTypeMember
							? {
									fieldPath: Q extends never
										? Q
										: J extends '<' | '<=' | '>=' | '>'
										? Q extends P
											? RemoveArrayTypeMember
											: never
										: J extends '==' | 'in'
										? Q extends P
											? never
											: RemoveArrayTypeMember
										: J extends 'not-in' | '!='
										? RemoveArrayTypeMember
										: never
									directionStr?: FirelordFirestore.OrderByDirection
									cursor?: {
										clause: 'startAt' | 'startAfter' | 'endAt' | 'endBefore'
										fieldValue:
											| Compare[J extends 'not-in' | '!=' ? Q : P]
											| FirelordFirestore.DocumentSnapshot
									}
							  }
							: never
						: never
				) => {
					const ref = (query || colRefRead).where(fieldPath, opStr, value)

					const queryRef = queryCreator(colRefRead, ref)

					const { orderBy: orderBy1, ...rest } = orderBy
						? orderByCreator(colRefRead, ref)(
								orderBy.fieldPath,
								orderBy.directionStr,
								orderBy.cursor
						  )
						: queryRef

					return (orderBy ? rest : queryRef) as J extends
						| '<'
						| '<='
						| '>'
						| '>'
						| '=='
						| 'in'
						? typeof rest
						: typeof queryRef
				},
				limit: (limit: number) => {
					return queryCreator(colRefRead, (query || colRefRead).limit(limit))
				},
				limitToLast: (limit: number) => {
					return queryCreator(
						colRefRead,
						(query || colRefRead).limitToLast(limit)
					)
				},
				orderBy: orderByCreator(colRefRead),
				get: (options?: FirelordFirestore.GetOptions) => {
					return (query || colRefRead).get(options)
				},
			}
		}

		const col = (collectionPath: T['colPath']) => {
			const colRefWrite = firestore().collection(
				collectionPath
			) as FirelordFirestore.CollectionReference<Write>
			const colRefRead =
				colRefWrite as FirelordFirestore.CollectionReference<Read>

			const doc = (documentPath: T['docPath']) => {
				const docWrite = colRefWrite.doc(documentPath)

				const docRead = colRefRead.doc(documentPath)

				const transactionCreator = (
					transaction: FirelordFirestore.Transaction
				) => {
					return {
						set: <
							J extends Partial<Write>,
							Z extends { merge?: true; mergeField?: (keyof Write)[] }
						>(
							data: J extends never
								? J
								: Z extends undefined
								? Write
								: PartialNoImplicitUndefined<Write, J>,
							options?: Z
						) => {
							if (options) {
								return transaction.set(
									docWrite,
									{
										updatedAt: time,
										...data,
									},
									options
								)
							} else {
								return transaction.set(docWrite, {
									...newTime,
									...data,
								})
							}
						},
						update: <J extends Partial<Write>>(
							data: J extends never ? J : PartialNoImplicitUndefined<Write, J>
						) => {
							return transaction.update(docWrite, { updatedAt: time, ...data })
						},
						delete: () => {
							return transaction.delete(docWrite)
						},
						get: () => {
							return transaction.get(docRead)
						},
					}
				}

				return {
					firestore: docRead.firestore,
					id: docRead.id,
					parent: docRead.parent,
					path: docRead.path,
					isEqual: (
						other: FirelordFirestore.DocumentReference<FirelordFirestore.DocumentData>
					) => {
						return docRead.isEqual(
							other as FirelordFirestore.DocumentReference<Read>
						)
					},
					onSnapshot: (
						observer: {
							next?: (
								snapshot: FirelordFirestore.DocumentSnapshot<Read>
							) => void
							error?: (error: Error) => void
						},
						options?: FirelordFirestore.SnapshotListenOptions
					) => {
						return docRead.onSnapshot(
							options || { includeMetadataChanges: false },
							{
								next: snapshot => {
									return observer.next && observer.next(snapshot)
								},
								error: err => {
									return observer.error && observer.error(err)
								},
							}
						)
					},
					set: <
						J extends Partial<Write>,
						Z extends { merge?: true; mergeField?: (keyof Write)[] }
					>(
						data: J extends never
							? J
							: Z extends undefined
							? Write
							: Z['merge'] extends true
							? PartialNoImplicitUndefined<Write, J>
							: Z['mergeField'] extends (keyof Write)[]
							? PartialNoImplicitUndefined<Write, J>
							: Write,
						options?: Z
					) => {
						if (options) {
							return docWrite.set(
								{
									updatedAt: time,
									...data,
								},
								options
							)
						} else {
							return docWrite.set({
								...newTime,
								...data,
							})
						}
					},
					update: <J extends Partial<Write>>(
						data: J extends never ? J : PartialNoImplicitUndefined<Write, J>
					) => {
						return docWrite.update({
							updatedAt: time,
							...data,
						})
					},
					get: (options?: FirelordFirestore.GetOptions) => {
						return docRead.get(options)
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
								data: J extends never ? J : PartialNoImplicitUndefined<Write, J>
							) => {
								return batch.update(docWrite, { updatedAt: time, ...data })
							},
						}
					},
					runTransaction: (
						callback: (
							transaction: ReturnType<typeof transactionCreator>
						) => Promise<unknown>
					) => {
						firestore().runTransaction(async transaction => {
							return callback(transactionCreator(transaction))
						})
					},
				}
			}

			// https://github.com/microsoft/TypeScript/issues/32022
			// https://stackoverflow.com/questions/51591335/typescript-spead-operator-on-object-with-method
			return {
				parent: colRefRead.parent,
				path: colRefRead.path,
				id: colRefRead.id,
				doc,
				add: (data: Write) => {
					return colRefWrite.add({
						...newTime,
						...data,
					})
				},
				...queryCreator(colRefRead),
			}
		}

		const colGroup = (collectionPath: T['colPath']) => {
			const colRefRead = firestore().collectionGroup(
				collectionPath
			) as FirelordFirestore.CollectionGroup<Read>
			return queryCreator(colRefRead)
		}

		return { col, colGroup }
	}
