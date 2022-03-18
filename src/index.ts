import {
	doc as doc_,
	collection as collection_,
	collectionGroup as collectionGroup_,
	getFirestore,
} from 'firebase/firestore'
import { MetaTypes } from './types'
import { docCreator, collectionCreator, collectionGroupCreator } from './refs'
import { FirebaseApp } from 'firebase/app'

/**
 Gets a FirelordReference instance that refers to the doc, collection, and collectionGroup at the specified absolute path.
 
 @param firestore — A reference to the root Firestore instance.
 
 @param path — A slash-separated full path to a collection.
 
 @returns — DocumentReference, CollectionReference and CollectionGroupReference instance.
 */
export const getFirelord =
	(app?: FirebaseApp) =>
	<T extends MetaTypes>(collectionPath: T['collectionPath']) => {
		const firestore = getFirestore(app)
		const doc = docCreator<T>(doc_, firestore, collectionPath)
		const collection = collectionCreator<T>(
			collection_,
			firestore,
			collectionPath
		)
		const collectionGroup = collectionGroupCreator<T>(
			collectionGroup_,
			firestore,
			collectionPath.split('/').pop() as string
		)
		return Object.freeze({
			doc,
			collection,
			collectionGroup,
		})
	}

export { Timestamp, GeoPoint, getFirestore } from 'firebase/firestore'
export { writeBatch } from './batch'
export * from './fieldValue'
export * from './onSnapshot'
export * from './operations'
export * from './queryConstraints'
export { runTransaction } from './transaction'
export { query } from './refs'
export type {
	Creator as Firelord,
	ServerTimestampFieldValue,
	DeleteAbleFieldValue,
	PossiblyReadAsUndefinedFieldValue,
	DocumentReference,
} from './types'
