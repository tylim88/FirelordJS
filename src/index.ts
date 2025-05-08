import { GetFirelordShakable } from './types'
import {
	docCreator,
	collectionCreator,
	collectionGroupCreator,
	andCreator,
	orCreator,
} from './refs'
import { Timestamp } from 'firebase/firestore'

export const getFirelordShakable: GetFirelordShakable =
	({
		docCreator,
		collectionCreator,
		collectionGroupCreator,
		andCreator,
		orCreator,
	}) =>
	// @ts-expect-error
	(firestore, ...collectionIDs) => {
		return {
			...(docCreator && {
				doc: docCreator(firestore, ...collectionIDs),
			}),
			...(collectionCreator && {
				collection: collectionCreator(firestore, ...collectionIDs),
			}),
			...(collectionGroupCreator && {
				collectionGroup: collectionGroupCreator(
					firestore,
					collectionIDs[collectionIDs.length - 1]!
				),
			}),
			...(orCreator && { or: orCreator() }),
			...(andCreator && { and: andCreator() }),
		}
	}

/**
 * Gets a FirelordReference instance that refers to the doc, collection, and collectionGroup at the specified absolute path.
 * @param firestore - A reference to the root `Firestore` instance.
 * @param collectionIDs - all the collectionID(s) needed to build this collection path.
 * @returns function of DocumentReference, CollectionReference, CollectionGroup and composite queries.
 */
export const getFirelord = getFirelordShakable({
	docCreator,
	collectionCreator,
	collectionGroupCreator,
	andCreator,
	orCreator,
})

export const toTimestamp = ({
	seconds,
	nanoseconds,
}: {
	seconds: number
	nanoseconds: number
}) => {
	return new Timestamp(seconds, nanoseconds)
}

export {
	getFirestore,
	Timestamp,
	GeoPoint,
	Bytes,
	connectFirestoreEmulator,
} from 'firebase/firestore'

export * from './batch'
export * from './transaction'
export * from './fieldValues'
export * from './operations'
export * from './queryConstraints'
export * from './refs'

export type {
	MetaType,
	MetaTypeCreator,
	AbstractMetaTypeCreator,
	ServerTimestamp,
	Delete,
	PossiblyReadAsUndefined,
	DocumentReference,
	CollectionReference,
	Query,
	DocumentSnapshot,
	QuerySnapshot,
	QueryDocumentSnapshot,
	WriteBatch,
	RunTransaction,
	GetDocIds,
	Transaction,
	GetCollectionIds,
	FirelordRef,
	OnSnapshot,
	Unsubscribe,
	ArrayUnionOrRemove,
} from './types'
