import { getFirestore } from 'firebase/firestore'
import {
	MetaType,
	IsValidID,
	GetNumberOfSlash,
	ErrorNumberOfForwardSlashIsNotEqual,
	CollectionReference,
	Query,
	Firestore,
} from './types'
import {
	docCreator,
	collectionCreator,
	collectionGroupCreator,
	Doc,
} from './refs'

/**
 Gets a FirelordReference instance that refers to the doc, collection, and collectionGroup at the specified absolute path.
 
 @param firestore 
 Optional. A reference to the Firestore database. If no value is provided, default Firestore instance is used. 
 If value is provided, the provided value is the new default instances(for this ref only).
 
 @returns function that return object literal contains DocumentReference, CollectionReference and CollectionGroupReference instance.
 */
export const getFirelord =
	<T extends MetaType>(firestore?: Firestore): Ref<T> =>
	<CollectionPath extends T['collectionPath'] = T['collectionPath']>(
		collectionPath: CollectionPath extends never
			? CollectionPath
			: GetNumberOfSlash<CollectionPath> extends GetNumberOfSlash<
					T['collectionPath']
			  >
			? IsValidID<CollectionPath, 'Collection', 'Path'>
			: ErrorNumberOfForwardSlashIsNotEqual<
					GetNumberOfSlash<T['collectionPath']>,
					GetNumberOfSlash<CollectionPath>
			  >
	): FirelordRef<T> => {
		const fStore = firestore || getFirestore()
		const doc = docCreator<T>(fStore, collectionPath)
		const collection = collectionCreator<T>(fStore, collectionPath)
		const collectionGroup = collectionGroupCreator<T>(
			fStore,
			collectionPath.split('/').pop() as string
		)
		return Object.freeze({
			doc,
			collection,
			collectionGroup,
		})
	}

/**
 Gets a FirelordReference instance that refers to the doc, collection, and collectionGroup at the specified absolute path.
 
 @param collectionPath 
 A slash-separated full path to a collection.
 
 @returns 
 DocumentReference, CollectionReference and CollectionGroupReference instance.
 */
export type Ref<T extends MetaType> = <
	CollectionPath extends T['collectionPath'] = T['collectionPath']
>(
	collectionPath: CollectionPath extends never
		? CollectionPath
		: GetNumberOfSlash<CollectionPath> extends GetNumberOfSlash<
				T['collectionPath']
		  >
		? IsValidID<CollectionPath, 'Collection', 'Path'>
		: ErrorNumberOfForwardSlashIsNotEqual<
				GetNumberOfSlash<T['collectionPath']>,
				GetNumberOfSlash<CollectionPath>
		  >
) => FirelordRef<T>

export type FirelordRef<T extends MetaType> = Readonly<{
	doc: Doc<T>
	/**
	 Gets a CollectionReference instance that refers to the collection at the specified absolute path.

@param firestore — A reference to the root Firestore instance.

@returns — The CollectionReference instance.
	 */
	collection: (firestore?: Firestore) => CollectionReference<T>
	/**
	Creates and returns a new Query instance that includes all documents in the database that are contained in a collection or subcollection with the given collectionId.

@param firestore — A reference to the root Firestore instance.

@returns — The created Query.
	 */
	collectionGroup: (firestore?: Firestore) => Query<T>
}>

export {
	Timestamp,
	GeoPoint,
	Bytes,
	getFirestore,
	terminate,
	initializeFirestore,
	loadBundle,
	clearIndexedDbPersistence,
	connectFirestoreEmulator,
	disableNetwork,
	enableIndexedDbPersistence,
	enableMultiTabIndexedDbPersistence,
	enableNetwork,
	onSnapshotsInSync,
	namedQuery,
	waitForPendingWrites,
	CACHE_SIZE_UNLIMITED,
} from 'firebase/firestore'

export * from './writeBatch'
export * from './runTransaction'
export * from './fieldValue'
export * from './fieldPath'
export * from './onSnapshot'
export * from './operations'
export * from './queryClauses'
export { query } from './refs'
export * from './equal'

export type {
	MetaType,
	MetaTypeCreator,
	ServerTimestamp,
	DeleteField,
	PossiblyReadAsUndefined,
	DocumentReference,
	CollectionReference,
	Query,
	DocumentSnapshot,
	QuerySnapshot,
	QueryDocumentSnapshot,
} from './types'
