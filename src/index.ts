import { getFirestore } from 'firebase/firestore'
import { MetaTypes, FirelordFirestore } from './types'
import { docCreator, collectionCreator, collectionGroupCreator } from './refs'

/**
 Gets a FirelordReference instance that refers to the doc, collection, and collectionGroup at the specified absolute path.
 
 @param firestore 
 Optional. A reference to the Firestore database. If no value is provided, default Firestore instance is used.
 
 @param path 
 A slash-separated full path to a collection.
 
 @returns 
 DocumentReference, CollectionReference and CollectionGroupReference instance.
 */
export const getFirelord =
	(firestore?: FirelordFirestore.Firestore) =>
	<T extends MetaTypes>(collectionPath: T['collectionPath']) => {
		const fstore = firestore || getFirestore()
		const doc = docCreator<T>(fstore, collectionPath)
		const collection = collectionCreator<T>(fstore, collectionPath)
		const collectionGroup = collectionGroupCreator<T>(
			fstore,
			collectionPath.split('/').pop() as string
		)
		return Object.freeze({
			doc,
			collection,
			collectionGroup,
		})
	}

export {
	Timestamp,
	GeoPoint,
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
} from 'firebase/firestore'
export * from './batch'
export * from './transaction'
export * from './fieldValue'
export * from './fieldPath'
export * from './onSnapshot'
export * from './operations'
export * from './queryClauses'
export { query } from './refs'
export * from './equal'
export type {
	MetaTypeCreator,
	ServerTimestamp,
	DeleteField,
	PossiblyReadAsUndefined,
	DocumentReference,
} from './types'
