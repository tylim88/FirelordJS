import { MetaType, FirelordFirestore, Query, IsValidID } from '../types'
import {
	collectionGroup as collectionGroup_,
	getFirestore,
} from 'firebase/firestore'

/**
 * Creates and returns a new `Query` instance that includes all documents in the
 * database that are contained in a collection or subcollection with the
 * given `collectionId`.
 *
 * @param collectionId - Identifies the collections to query over. Every
 * collection or subcollection with this ID as the last segment of its path
 * will be included. Cannot contain a slash.
 * @param firestore - Optional. A reference to the root `Firestore` instance. If no value is provided, default Firestore instance is used.
 * @returns The created `Query`.
 */
export const collectionGroup = <
	T extends MetaType,
	CollectionId extends T['collectionID'] = T['collectionID']
>(
	collectionId: CollectionId extends never
		? CollectionId
		: CollectionId extends IsValidID<CollectionId, 'Collection'>
		? T['collectionID']
		: IsValidID<CollectionId, 'Collection'>,
	firestore?: FirelordFirestore.Firestore
) => {
	return collectionGroup_(firestore || getFirestore(), collectionId) as Query<T>
}
export const collectionGroupCreator =
	<T extends MetaType>(
		firestore: FirelordFirestore.Firestore,
		collectionID: T['collectionID']
	) =>
	() => {
		return collectionGroup(collectionID as string, firestore) as Query<T>
	}
