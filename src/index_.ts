import { OmitKeys, Firelord } from './firelord'
import { FirelordFirestore } from './firelordFirestore'
import { QueryCreator } from './queryCreator'
import { DocCreator } from './doc'

export type firelord = (firestore: FirelordFirestore.Firestore) => <
	T extends {
		colPath: string
		docID: string
		colName: string
		read: FirelordFirestore.DocumentData & Firelord.CreatedUpdatedRead
		write: FirelordFirestore.DocumentData & Firelord.CreatedUpdatedWrite
		writeNested: FirelordFirestore.DocumentData & Firelord.CreatedUpdatedWrite
		compare: FirelordFirestore.DocumentData & Firelord.CreatedUpdatedCompare
		base: FirelordFirestore.DocumentData
	} = never
>() => {
	col: (collectionPath: T['colPath']) => {
		parent: FirelordFirestore.DocumentReference<FirelordFirestore.DocumentData> | null
		path: string
		id: string
		doc: ReturnType<DocCreator<T>>
		add: (
			data: OmitKeys<T['writeNested'], 'createdAt' | 'updatedAt'>
		) => Promise<ReturnType<ReturnType<DocCreator<T>>>>
	} & ReturnType<QueryCreator<T>>
	colGroup: (collectionPath: T['colName']) => ReturnType<QueryCreator<T>>
	fieldValue: {
		increment: (value: number) => Firelord.NumberMasked
		serverTimestamp: () => Firelord.ServerTimestampMasked
		arrayUnion: <T>(...values: T[]) => Firelord.ArrayMasked<T>
		arrayRemove: <T>(...values: T[]) => Firelord.ArrayMasked<T>
	}
	runTransaction: <Y>(
		updateFunction: (transaction: FirelordFirestore.Transaction) => Promise<Y>
	) => Promise<Y>
}
