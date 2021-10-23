import { firestore } from 'firebase-admin'
import {
	OmitKeys,
	PartialNoImplicitUndefined,
	ExcludePropertyKeys,
	RemoveArray,
} from './firelord'
import { FirelordFirestore } from './firelordFirestore'

const time = firestore.FieldValue.serverTimestamp()

export const firelord = <
	T extends {
		colPath: string
		docPath: string
		read: firestore.DocumentData & FirelordFirestore.CreatedUpdatedRead
		write: firestore.DocumentData & FirelordFirestore.CreatedUpdatedWrite
		compare: firestore.DocumentData & FirelordFirestore.CreatedUpdatedCompare
		base: firestore.DocumentData
	} = never
>() => {
	type Write = OmitKeys<T['write'], 'updatedAt' | 'createdAt'>
	type Read = T['read']
	type Compare = T['compare']
	type RemoveArrayTypeMember = ExcludePropertyKeys<Compare, unknown[]>

	const queryCreator = (
		colRefRead:
			| firestore.CollectionReference<Read>
			| firestore.CollectionGroup<Read>,
		query?: firestore.Query<Read>
	) => {
		const orderByCreator =
			(
				colRefRead:
					| firestore.CollectionReference<Read>
					| firestore.CollectionGroup<Read>,
				query?: firestore.Query<Read>
			) =>
			<P extends RemoveArrayTypeMember>(
				fieldPath: P,
				directionStr: FirebaseFirestore.OrderByDirection = 'asc',
				cursor?: {
					clause: 'startAt' | 'startAfter' | 'endAt' | 'endBefore'
					fieldValue: Compare[P] | firestore.DocumentSnapshot
				}
			) => {
				const ref = (query || colRefRead).orderBy(fieldPath, directionStr)

				return queryCreator(
					colRefRead,
					cursor ? ref[cursor.clause](cursor.fieldValue) : ref
				)
			}

		return {
			firestore: colRefRead.firestore,
			stream: () => {
				return colRefRead.stream()
			},
			offset: (offset: number) => {
				return queryCreator(colRefRead, (query || colRefRead).offset(offset))
			},
			where: <
				P extends string & keyof Read,
				J extends FirebaseFirestore.WhereFilterOp,
				Q extends RemoveArrayTypeMember
			>(
				fieldPath: P,
				opStr: J extends never
					? J
					: Compare[P] extends unknown[]
					? 'array-contains' | 'in' | 'array-contains-any'
					: '<' | '<=' | '==' | '!=' | '>=' | '>' | 'not-in' | 'in',
				value: J extends 'not-in' | 'in'
					? Compare[P][]
					: J extends 'array-contains'
					? RemoveArray<Compare[P]>
					: Compare[P],
				orderBy?: J extends 'in' | '='
					? never
					: J extends '<' | '<=' | '>' | '>=' | 'not-in'
					? P extends RemoveArrayTypeMember
						? {
								fieldPath?: Q extends never
									? Q
									: J extends 'not-in'
									? RemoveArrayTypeMember
									: never
								directionStr?: FirebaseFirestore.OrderByDirection
								cursor?: {
									clause: 'startAt' | 'startAfter' | 'endAt' | 'endBefore'
									fieldValue:
										| Compare[J extends 'not-in' ? Q : P]
										| firestore.DocumentSnapshot
								}
						  }
						: never
					: never
			) => {
				const ref = (query || colRefRead).where(fieldPath, opStr, value)

				const queryRef = queryCreator(colRefRead, ref)

				const { orderBy: orderBy1, ...rest } = orderBy
					? orderByCreator(colRefRead, ref)(
							orderBy.fieldPath ||
								(fieldPath as unknown as string & RemoveArrayTypeMember),
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
			get: () => {
				return (query || colRefRead).get()
			},
		}
	}

	const col = (collectionPath: T['colPath']) => {
		const colRefWrite = firestore().collection(
			collectionPath
		) as firestore.CollectionReference<Write>
		const colRefRead = colRefWrite as firestore.CollectionReference<Read>

		const doc = (documentPath: T['docPath']) => {
			const docWrite = colRefWrite.doc(documentPath)

			const docRead = colRefRead.doc(documentPath)

			const transactionCreator = (transaction: firestore.Transaction) => {
				return {
					create: (data: Write) => {
						return transaction.create(docWrite, {
							createdAt: time,
							updatedAt: new Date(0),
							...data,
						})
					},
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
								createdAt: time,
								updatedAt: new Date(0),
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
					getAll: <J extends firestore.DocumentData = firestore.DocumentData>(
						documentReferences: J[],
						options: firestore.ReadOptions
					) => {
						return transaction.getAll<J>(...documentReferences, options)
					},
				}
			}

			return {
				firestore: docRead.firestore,
				id: docRead.id,
				parent: docRead.parent,
				path: docRead.path,
				listCollections: () => {
					return docRead.listCollections()
				},
				isEqual: (
					other: firestore.DocumentReference<firestore.DocumentData>
				) => {
					return docRead.isEqual(other as firestore.DocumentReference<Read>)
				},
				onSnapshot: (
					next?: (snapshot: firestore.DocumentSnapshot<Read>) => void,
					error?: (error: Error) => void
				) => {
					return docRead.onSnapshot(
						snapshot => {
							return next && next(snapshot)
						},
						err => {
							return error && error(err)
						}
					)
				},
				create: (data: Write) => {
					return docWrite.create({
						createdAt: time,
						updatedAt: new Date(0),
						...data,
					})
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
							createdAt: time,
							updatedAt: new Date(0),
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
				get: () => {
					return docRead.get()
				},
				delete: () => docWrite.delete(),
				batch: (batch: firestore.WriteBatch) => {
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
						create: (data: Write) => {
							return batch.create(docWrite, {
								createdAt: time,
								updatedAt: new Date(0),
								...data,
							})
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
			listDocuments: () => {
				return colRefRead.listDocuments()
			},
			doc,
			add: (data: Write) => {
				return colRefWrite.add({
					createdAt: time,
					updatedAt: new Date(0),
					...data,
				})
			},
			...queryCreator(colRefRead),
		}
	}

	const colGroup = (collectionPath: T['colPath']) => {
		const colRefRead = firestore().collectionGroup(
			collectionPath
		) as firestore.CollectionGroup<Read>
		return queryCreator(colRefRead)
	}

	return { col, colGroup }
}
export const ozai = firelord

export type { Firelord } from './firelord'
