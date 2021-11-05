import {
	OmitKeys,
	ExcludePropertyKeys,
	RemoveArray,
	Firelord,
} from './firelord'
import { FirelordFirestore } from './firelordFirestore'
import { docSnapshotCreator, DocSnapshotCreator } from './doc'

// https://stackoverflow.com/questions/69724861/recursive-type-become-any-after-emit-declaration-need-implicit-solution

export type QueryCreator<
	T extends {
		colPath: string
		docID: string
		colName: string
		read: FirelordFirestore.DocumentData & Firelord.CreatedUpdatedRead
		write: FirelordFirestore.DocumentData & Firelord.CreatedUpdatedWrite
		writeNested: FirelordFirestore.DocumentData & Firelord.CreatedUpdatedWrite
		compare: FirelordFirestore.DocumentData & Firelord.CreatedUpdatedCompare
		base: FirelordFirestore.DocumentData
	},
	PermanentlyOmittedKeys extends keyof ReturnType<
		QueryCreator<T, PermanentlyOmittedKeys, M>
	> = never,
	M extends 'col' | 'colGroup' = 'col'
> = (
	firestore: FirelordFirestore.Firestore,
	colRef: M extends 'col'
		? FirelordFirestore.CollectionReference<T['read']>
		: M extends 'colGroup'
		? undefined
		: never,
	query: FirelordFirestore.Query<T['read']>
) => {
	firestore: typeof query.firestore
	where: <
		P extends string & keyof T['read'],
		J extends FirelordFirestore.WhereFilterOp,
		Q extends ExcludePropertyKeys<T['compare'], unknown[]>
	>(
		fieldPath: P,
		opStr: J extends never
			? J
			: T['compare'][P] extends unknown[]
			? 'array-contains' | 'in' | 'array-contains-any'
			: '<' | '<=' | '>=' | '>' | '==' | '!=' | 'not-in' | 'in',
		value: J extends 'not-in' | 'in'
			? T['compare'][P][]
			: J extends 'array-contains'
			? RemoveArray<T['compare'][P]>
			: T['compare'][P],
		orderBy?: J extends '<' | '<=' | '>=' | '>' | '==' | 'in' | '!=' | 'not-in'
			? P extends ExcludePropertyKeys<T['compare'], unknown[]>
				? {
						fieldPath: Q extends never
							? Q
							: J extends '<' | '<=' | '>=' | '>'
							? Q extends P
								? ExcludePropertyKeys<T['compare'], unknown[]>
								: never
							: J extends '==' | 'in'
							? Q extends P
								? never
								: ExcludePropertyKeys<T['compare'], unknown[]>
							: J extends 'not-in' | '!='
							? ExcludePropertyKeys<T['compare'], unknown[]>
							: never
						directionStr?: FirelordFirestore.OrderByDirection
						cursor?: {
							clause: 'startAt' | 'startAfter' | 'endAt' | 'endBefore'
							fieldValue:
								| T['compare'][J extends 'not-in' | '!=' ? Q : P]
								| FirelordFirestore.DocumentSnapshot
						}
				  }
				: never
			: never
	) => J extends '<' | '<=' | '>' | '>' | '==' | 'in'
		? OmitKeys<
				ReturnType<QueryCreator<T, PermanentlyOmittedKeys, M>>,
				'orderBy' | PermanentlyOmittedKeys
		  >
		: OmitKeys<
				ReturnType<QueryCreator<T, PermanentlyOmittedKeys, M>>,
				PermanentlyOmittedKeys
		  >
	limit: (
		limit: number
	) => OmitKeys<
		ReturnType<
			QueryCreator<T, 'limit' | 'limitToLast' | PermanentlyOmittedKeys>
		>,
		'limit' | 'limitToLast' | PermanentlyOmittedKeys
	>
	limitToLast: (
		limit: number
	) => OmitKeys<
		ReturnType<
			QueryCreator<T, 'limit' | 'limitToLast' | PermanentlyOmittedKeys>
		>,
		'limit' | 'limitToLast' | PermanentlyOmittedKeys
	>
	orderBy: <P extends ExcludePropertyKeys<T['compare'], unknown[]>>(
		fieldPath: P,
		directionStr: FirelordFirestore.OrderByDirection,
		cursor?: {
			clause: 'startAt' | 'startAfter' | 'endAt' | 'endBefore'
			fieldValue: T['compare'][P] | FirelordFirestore.DocumentSnapshot
		}
	) => OmitKeys<
		ReturnType<QueryCreator<T, PermanentlyOmittedKeys, M>>,
		PermanentlyOmittedKeys
	>
	get: (
		options?: FirelordFirestore.GetOptions
	) => Promise<ReturnType<QuerySnapshotCreator<T>>>
}

// need to make generic mandatory https://stackoverflow.com/questions/55610260/how-to-make-generics-mandatory
// however due to this is a recursive function, it is not possible
// luckily this is only used in 2 places and is explicitly typed, so everything is good
export const queryCreator = <
	T extends {
		colPath: string
		docID: string
		colName: string
		read: FirelordFirestore.DocumentData & Firelord.CreatedUpdatedRead
		write: FirelordFirestore.DocumentData & Firelord.CreatedUpdatedWrite
		writeNested: FirelordFirestore.DocumentData & Firelord.CreatedUpdatedWrite
		compare: FirelordFirestore.DocumentData & Firelord.CreatedUpdatedCompare
		base: FirelordFirestore.DocumentData
	},
	PermanentlyOmittedKeys extends keyof ReturnType<
		QueryCreator<T, PermanentlyOmittedKeys, M>
	> = never,
	M extends 'col' | 'colGroup' = 'col'
>(
	firestore: FirelordFirestore.Firestore,
	colRef: M extends 'col'
		? FirelordFirestore.CollectionReference<T['read']>
		: M extends 'colGroup'
		? undefined
		: never,
	query: FirelordFirestore.Query<T['read']>
): ReturnType<QueryCreator<T>> => {
	const orderByCreator =
		(query: FirelordFirestore.Query<T['read']>) =>
		<P extends ExcludePropertyKeys<T['compare'], unknown[]>>(
			fieldPath: P,
			directionStr: FirelordFirestore.OrderByDirection = 'asc',
			cursor?: {
				clause: 'startAt' | 'startAfter' | 'endAt' | 'endBefore'
				fieldValue: T['compare'][P] | FirelordFirestore.DocumentSnapshot
			}
		) => {
			const ref = query.orderBy(fieldPath, directionStr)

			return queryCreator<T, PermanentlyOmittedKeys, M>(
				firestore,
				colRef,
				cursor ? ref[cursor.clause](cursor.fieldValue) : ref
			)
		}

	return {
		firestore: query.firestore,
		where: <
			P extends string & keyof T['read'],
			J extends FirelordFirestore.WhereFilterOp,
			Q extends ExcludePropertyKeys<T['compare'], unknown[]>
		>(
			fieldPath: P,
			opStr: J extends never
				? J
				: T['compare'][P] extends unknown[]
				? 'array-contains' | 'in' | 'array-contains-any'
				: '<' | '<=' | '>=' | '>' | '==' | '!=' | 'not-in' | 'in',
			value: J extends 'not-in' | 'in'
				? T['compare'][P][]
				: J extends 'array-contains'
				? RemoveArray<T['compare'][P]>
				: T['compare'][P],
			orderBy?: J extends
				| '<'
				| '<='
				| '>='
				| '>'
				| '=='
				| 'in'
				| '!='
				| 'not-in'
				? P extends ExcludePropertyKeys<T['compare'], unknown[]>
					? {
							fieldPath: Q extends never
								? Q
								: J extends '<' | '<=' | '>=' | '>'
								? Q extends P
									? ExcludePropertyKeys<T['compare'], unknown[]>
									: never
								: J extends '==' | 'in'
								? Q extends P
									? never
									: ExcludePropertyKeys<T['compare'], unknown[]>
								: J extends 'not-in' | '!='
								? ExcludePropertyKeys<T['compare'], unknown[]>
								: never
							directionStr?: FirelordFirestore.OrderByDirection
							cursor?: {
								clause: 'startAt' | 'startAfter' | 'endAt' | 'endBefore'
								fieldValue:
									| T['compare'][J extends 'not-in' | '!=' ? Q : P]
									| FirelordFirestore.DocumentSnapshot
							}
					  }
					: never
				: never
		) => {
			const ref = query.where(fieldPath, opStr, value)

			const queryRef = queryCreator<T, PermanentlyOmittedKeys, M>(
				firestore,
				colRef,
				ref
			)

			const finalRef = orderBy
				? orderByCreator(ref)(
						orderBy.fieldPath,
						orderBy.directionStr,
						orderBy.cursor
				  )
				: queryRef

			return finalRef as J extends '<' | '<=' | '>' | '>' | '==' | 'in'
				? OmitKeys<typeof finalRef, 'orderBy'>
				: typeof finalRef
		},
		limit: (limit: number) => {
			return queryCreator<T, PermanentlyOmittedKeys, M>(
				firestore,
				colRef,
				query.limit(limit)
			)
		},
		limitToLast: (limit: number) => {
			return queryCreator<T, PermanentlyOmittedKeys, M>(
				firestore,
				colRef,
				query.limitToLast(limit)
			)
		},
		orderBy: orderByCreator(query),
		get: (options?: FirelordFirestore.GetOptions) => {
			return query.get(options).then(querySnapshot => {
				return querySnapshotCreator<T, M>(firestore, colRef, querySnapshot)
			})
		},
	}
}

export type QuerySnapshotCreator<
	T extends {
		colPath: string
		docID: string
		colName: string
		read: FirelordFirestore.DocumentData & Firelord.CreatedUpdatedRead
		write: FirelordFirestore.DocumentData & Firelord.CreatedUpdatedWrite
		writeNested: FirelordFirestore.DocumentData & Firelord.CreatedUpdatedWrite
		compare: FirelordFirestore.DocumentData & Firelord.CreatedUpdatedCompare
		base: FirelordFirestore.DocumentData
	},
	M extends 'col' | 'colGroup' = 'col'
> = (
	firestore: FirelordFirestore.Firestore,
	colRef: M extends 'col'
		? FirelordFirestore.CollectionReference<T['read']>
		: M extends 'colGroup'
		? undefined
		: never,
	querySnapshot: FirelordFirestore.QuerySnapshot<T['read']>
) => {
	docChanges: () => FirelordFirestore.DocumentChange<T['read']>[]
	docs: ReturnType<DocSnapshotCreator<T>>[]
	empty: boolean
	forEach: (
		callback: (result: ReturnType<DocSnapshotCreator<T>>) => void
	) => void
	isEqual: (other: FirelordFirestore.QuerySnapshot) => boolean
	size: number
}

export const querySnapshotCreator = <
	T extends {
		colPath: string
		docID: string
		colName: string
		read: FirelordFirestore.DocumentData & Firelord.CreatedUpdatedRead
		write: FirelordFirestore.DocumentData & Firelord.CreatedUpdatedWrite
		writeNested: FirelordFirestore.DocumentData & Firelord.CreatedUpdatedWrite
		compare: FirelordFirestore.DocumentData & Firelord.CreatedUpdatedCompare
		base: FirelordFirestore.DocumentData
	},
	M extends 'col' | 'colGroup' = 'col'
>(
	firestore: FirelordFirestore.Firestore,
	colRef: M extends 'col'
		? FirelordFirestore.CollectionReference<T['read']>
		: M extends 'colGroup'
		? undefined
		: never,
	querySnapshot: FirelordFirestore.QuerySnapshot<T['read']>
): ReturnType<QuerySnapshotCreator<T, M>> => {
	return {
		docChanges: () => {
			return querySnapshot.docChanges()
		},
		docs: querySnapshot.docs.map(queryDocumentSnapshot => {
			return docSnapshotCreator<T, M>(firestore, colRef, queryDocumentSnapshot)
		}),
		empty: querySnapshot.empty,
		forEach: (
			callback: (result: ReturnType<DocSnapshotCreator<T>>) => void
		) => {
			querySnapshot.forEach(queryDocumentSnapshot => {
				return callback(
					docSnapshotCreator<T, M>(firestore, colRef, queryDocumentSnapshot)
				)
			})
		},
		isEqual: (other: FirelordFirestore.QuerySnapshot) => {
			return querySnapshot.isEqual(
				other as FirelordFirestore.QuerySnapshot<T['read']>
			)
		},
		size: querySnapshot.size,
	}
}
