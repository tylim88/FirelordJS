import { Firelord } from './firelord'
import { FirelordFirestore } from './firelordFirestore'
import { docSnapshotCreator, DocSnapshotCreator } from './doc'

const docChangesCreator: <
	T extends Firelord.MetaType,
	M extends 'col' | 'colGroup' = 'col'
>(
	firestore: FirelordFirestore.Firestore,
	colRef: M extends 'col'
		? FirelordFirestore.CollectionReference<T['read']>
		: M extends 'colGroup'
		? undefined
		: never,
	docChange: FirelordFirestore.DocumentChange<T['read']>
) => ReturnType<DocChangesCreator<T, M>> = <
	T extends Firelord.MetaType,
	M extends 'col' | 'colGroup' = 'col'
>(
	firestore: FirelordFirestore.Firestore,
	colRef: M extends 'col'
		? FirelordFirestore.CollectionReference<T['read']>
		: M extends 'colGroup'
		? undefined
		: never,
	docChange: FirelordFirestore.DocumentChange<T['read']>
) => {
	return {
		doc: docSnapshotCreator<T, M>(firestore, colRef, docChange.doc),
		newIndex: docChange.newIndex,
		oldIndex: docChange.oldIndex,
		type: docChange.type,
	}
}

type DocChangesCreator<
	T extends Firelord.MetaType,
	M extends 'col' | 'colGroup' = 'col'
> = (
	firestore: FirelordFirestore.Firestore,
	colRef: M extends 'col'
		? FirelordFirestore.CollectionReference<T['read']>
		: M extends 'colGroup'
		? undefined
		: never,
	docChange: FirelordFirestore.DocumentChange<T['read']>
) => {
	doc: ReturnType<DocSnapshotCreator<T, M>>
	newIndex: number
	oldIndex: number
	type: FirelordFirestore.DocumentChangeType
}

export type QuerySnapshotCreator<
	T extends Firelord.MetaType,
	M extends 'col' | 'colGroup' = 'col'
> = (
	firestore: FirelordFirestore.Firestore,
	colRef: M extends 'col'
		? FirelordFirestore.CollectionReference<T['read']>
		: M extends 'colGroup'
		? undefined
		: never,
	querySnapshot: FirelordFirestore.QuerySnapshot<T['read']>,
	not_In_Extra: { key: string; elements: unknown[] }
) => {
	docChanges: () => ReturnType<DocChangesCreator<T, M>>[]
	docs: ReturnType<DocSnapshotCreator<T, M>>[]
	empty: boolean
	forEach: (
		callback: (result: ReturnType<DocSnapshotCreator<T, M>>) => void
	) => void
	isEqual: (other: FirelordFirestore.QuerySnapshot) => boolean
	size: number
}

export const querySnapshotCreator: <
	T extends Firelord.MetaType,
	M extends 'col' | 'colGroup' = 'col'
>(
	firestore: FirelordFirestore.Firestore,
	colRef: M extends 'col'
		? FirelordFirestore.CollectionReference<T['read']>
		: M extends 'colGroup'
		? undefined
		: never,
	querySnapshot: FirelordFirestore.QuerySnapshot<T['read']>,
	not_In_Extra: { key: string; elements: unknown[] }
) => ReturnType<QuerySnapshotCreator<T, M>> = <
	T extends Firelord.MetaType,
	M extends 'col' | 'colGroup' = 'col'
>(
	firestore: FirelordFirestore.Firestore,
	colRef: M extends 'col'
		? FirelordFirestore.CollectionReference<T['read']>
		: M extends 'colGroup'
		? undefined
		: never,
	querySnapshot: FirelordFirestore.QuerySnapshot<T['read']>,
	not_In_Extra: { key: string; elements: unknown[] } = {
		key: '',
		elements: [],
	}
) => {
	const { key, elements } = not_In_Extra

	const docs = querySnapshot.docs.reduce<
		ReturnType<DocSnapshotCreator<T, M>>[]
	>((acc, queryDocumentSnapshot) => {
		if (
			queryDocumentSnapshot.data() &&
			elements.includes(queryDocumentSnapshot.data()[key])
		) {
			return acc
		} else {
			return acc.concat(
				docSnapshotCreator<T, M>(firestore, colRef, queryDocumentSnapshot)
			)
		}
	}, [])
	return {
		docChanges: () => {
			return querySnapshot
				.docChanges()
				.reduce<ReturnType<DocChangesCreator<T, M>>[]>((acc, change) => {
					if (change.doc?.data() && elements.includes(change.doc.data()[key])) {
						return acc
					} else {
						return acc.concat(
							docChangesCreator<T, M>(firestore, colRef, change)
						)
					}
				}, [])
		},
		docs,
		empty: docs.length === 0,
		forEach: (
			callback: (result: ReturnType<DocSnapshotCreator<T, M>>) => void
		) => {
			docs.forEach(callback)
		},
		isEqual: (other: FirelordFirestore.QuerySnapshot) => {
			return querySnapshot.isEqual(
				other as FirelordFirestore.QuerySnapshot<T['read']>
			)
		},
		size: docs.length,
	}
}
