import {
	MetaType,
	Query,
	Firestore,
	Doc,
	Collection,
	GetOddOrEvenSegments,
} from './types'
import { docCreator, collectionCreator, collectionGroupCreator } from './refs'
import { isFirestore } from './utils'

/**
 * Gets a FirelordReference instance that refers to the doc, collection, and collectionGroup at the specified absolute path.
 * @param firestore - optional and skippable(function overloading), a reference to the root `Firestore` instance.
 * @param collectionIDs - all the collectionID(s) needed to build this collection path.
 * @returns Creator function of DocumentReference, CollectionReference and CollectionGroupReference.
 */
export const getFirelord: GetFirelord = (firestore, ...collectionIDs) => {
	const fStore = isFirestore(firestore) ? firestore : undefined
	const colIDs = isFirestore(firestore)
		? collectionIDs
		: [firestore, ...collectionIDs]
	const doc = docCreator(
		fStore,
		// @ts-expect-error
		...colIDs
	)
	const collection = collectionCreator(
		fStore,
		// @ts-expect-error
		...colIDs
	)
	const collectionGroup = collectionGroupCreator(
		fStore,
		colIDs[colIDs.length - 1]!
	)
	return {
		doc,
		collection,
		collectionGroup,
	}
}

export type GetFirelord = {
	<T extends MetaType>(
		firestore: Firestore,
		...collectionIDs: GetOddOrEvenSegments<T['collectionPath']>
	): FirelordRef<T>
	<T extends MetaType>(
		...collectionIDs: GetOddOrEvenSegments<T['collectionPath']>
	): FirelordRef<T>
}

export type FirelordRef<T extends MetaType> = Readonly<{
	/**
	 * Gets a `DocumentReference` instance that refers to the document at the
	 * specified absolute path.
	 *
	 * @param firestore - optional and skippable(function overloading), a reference to the root `Firestore` instance.
	 * @param documentId - all the docID(s) needed to build this document path.
	 * @returns The `DocumentReference` instance.
	 */
	doc: Doc<T>
	/**
	 * Gets a `CollectionReference` instance that refers to the collection at
	 * the specified absolute path.
	 *
	 * @param firestore - optional and skippable(function overloading), a reference to the root `Firestore` instance.
	 * @param docIDs - all the docID(s) needed to build this collection path.
	 * @returns The `CollectionReference` instance.
	 */
	collection: Collection<T>
	/**
	 * @param firestore — A reference to the root Firestore instance.
	 * @returns — The created Query.
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
