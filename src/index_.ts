import { Firelord } from './firelord'
import { FirelordFirestore } from './firelordFirestore'
import { QueryCreator } from './queryCreator'
import { DocCreator } from './docCreator'

export type FirelordWrapper = (firestore: FirelordFirestore.Firestore) => {
	fieldValue: {
		increment: (value: number) => Firelord.NumberMasked
		serverTimestamp: () => Firelord.ServerTimestampMasked
		arrayUnion: <T extends string, Y>(
			key: T,
			...values: Y[]
		) => { [key in T]: Firelord.ArrayMasked<Y> }
		arrayRemove: <T extends string, Y>(
			key: T,
			...values: Y[]
		) => { [key in T]: Firelord.ArrayMasked<Y> }
	}
	batch: () => FirelordFirestore.WriteBatch
	runTransaction: <Y>(
		updateFunction: (transaction: FirelordFirestore.Transaction) => Promise<Y>
	) => Promise<Y>
	wrapper: <T extends Firelord.MetaType = never>() => Wrapper<T>
}

export type Wrapper<T extends Firelord.MetaType = never> = {
	col: (collectionPath: T['colPath']) => {
		parent: FirelordFirestore.DocumentReference<FirelordFirestore.DocumentData> | null
		path: string
		id: string
		doc: ReturnType<DocCreator<T, 'col'>>
		add: (
			data: Firelord.InternalReadWriteConverter<T>['writeNestedCreate']
		) => Promise<ReturnType<ReturnType<DocCreator<T, 'col'>>>>
	} & ReturnType<QueryCreator<T, never, 'col'>>
	colGroup: (
		collectionPath: T['colName']
	) => ReturnType<QueryCreator<T, never, 'colGroup'>>
}
