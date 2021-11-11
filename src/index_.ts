import { FirelordUtils } from './firelordUtils'
import { FirelordFirestore } from './firelordFirestore'
import { QueryCreator } from './queryCreator'
import { DocCreator } from './docCreator'

export type Firelord = (firestore: FirelordFirestore.Firestore) => {
	fieldValue: {
		increment: (value: number) => FirelordUtils.NumberMasked
		serverTimestamp: () => FirelordUtils.ServerTimestampMasked
		arrayUnion: <T extends string, Y>(
			key: T,
			...values: Y[]
		) => { [key in T]: FirelordUtils.ArrayMasked<Y> }
		arrayRemove: <T extends string, Y>(
			key: T,
			...values: Y[]
		) => { [key in T]: FirelordUtils.ArrayMasked<Y> }
	}
	batch: () => FirelordFirestore.WriteBatch
	runTransaction: <Y>(
		updateFunction: (transaction: FirelordFirestore.Transaction) => Promise<Y>
	) => Promise<Y>
	wrapper: <T extends FirelordUtils.MetaType = never>() => Wrapper<T>
}

export type Wrapper<T extends FirelordUtils.MetaType = never> = {
	col: (collectionPath: T['colPath']) => {
		parent: FirelordFirestore.DocumentReference<FirelordFirestore.DocumentData> | null
		path: string
		id: string
		doc: DocCreator<T, 'col'>
		add: (
			data: FirelordUtils.InternalReadWriteConverter<T>['writeNestedCreate']
		) => Promise<ReturnType<DocCreator<T, 'col'>>>
	} & QueryCreator<T, never, 'col'>
	colGroup: (collectionPath: T['colName']) => QueryCreator<T, never, 'colGroup'>
}
