import { Firelord } from './firelord'
import { FirelordFirestore } from './firelordFirestore'
import { queryCreator } from './queryCreator'
import { firelord as FirelordWrapper } from './index_'
import { docCreator } from './doc'
import { createTime } from './utils'

export const firelord: FirelordWrapper =
	(firestore: FirelordFirestore.Firestore) =>
	<T extends Firelord.MetaType = never>() => {
		type Write = Firelord.InternalReadWriteConverter<T>['write']
		type WriteNested = Firelord.InternalReadWriteConverter<T>['writeNested']
		type Read = Firelord.InternalReadWriteConverter<T>['read']

		const { createdAt } = createTime(firestore)

		const col = (collectionPath: T['colPath']) => {
			const colRefWrite = firestore().collection(
				collectionPath
			) as FirelordFirestore.CollectionReference<Write>
			const colRefRead =
				colRefWrite as FirelordFirestore.CollectionReference<Read>

			// https://github.com/microsoft/TypeScript/issues/32022
			// https://stackoverflow.com/questions/51591335/typescript-spead-operator-on-object-with-method
			// conclusion: do not spread
			return {
				parent: colRefRead.parent,
				path: colRefRead.path,
				id: colRefRead.id,
				doc: docCreator<T>(firestore, colRefWrite, undefined),
				add: (data: WriteNested) => {
					return colRefWrite
						.add({
							...createdAt,
							...data,
						})
						.then(documentReference => {
							return docCreator<T>(
								firestore,
								colRefWrite,
								documentReference
							)(documentReference.id)
						})
				},
				...queryCreator<T>(firestore, colRefRead, colRefRead),
			}
		}

		const colGroup = (collectionPath: T['colName']) => {
			const colRefRead = firestore().collectionGroup(
				collectionPath
			) as FirelordFirestore.CollectionGroup<Read>
			return queryCreator<T, never, 'colGroup'>(
				firestore,
				undefined,
				colRefRead
			)
		}

		return {
			col,
			colGroup,
			fieldValue: {
				increment: (value: number) => {
					return firestore.FieldValue.increment(
						value
					) as unknown as Firelord.NumberMasked
				},

				serverTimestamp: () => {
					return firestore.FieldValue.serverTimestamp() as unknown as Firelord.ServerTimestampMasked
				},
				arrayUnion: <T extends string, Y>(key: T, ...values: Y[]) => {
					return (values.length > 0
						? {
								[key]: firestore.FieldValue.arrayUnion(...values),
						  }
						: {}) as unknown as {
						[key in T]: Firelord.ArrayMasked<Y>
					}
				},
				arrayRemove: <T extends string, Y>(key: T, ...values: Y[]) => {
					return (values.length > 0
						? {
								[key]: firestore.FieldValue.arrayRemove(...values),
						  }
						: {}) as unknown as {
						[key in T]: Firelord.ArrayMasked<Y>
					}
				},
			},
			runTransaction: <Y>(
				updateFunction: (
					transaction: FirelordFirestore.Transaction
				) => Promise<Y>
			) => {
				return firestore().runTransaction<Y>(updateFunction)
			},
		}
	}

export const ozai = firelord

export { flatten } from './utils'

export type { Firelord } from './firelord'
