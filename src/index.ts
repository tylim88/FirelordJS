import {
	MetaType,
	Query,
	Firestore,
	Doc,
	Collection,
	GetOddOrEvenSegments,
	QueryCompositeFilter,
} from './types'
import {
	docCreator,
	collectionCreator,
	collectionGroupCreator,
	queryCompositeFilterCreator,
} from './refs'

/**
 * Gets a FirelordReference instance that refers to the doc, collection, and collectionGroup at the specified absolute path.
 * @param firestore - A reference to the root `Firestore` instance.
 * @param collectionIDs - all the collectionID(s) needed to build this collection path.
 * @returns Creator function of DocumentReference, CollectionReference and CollectionGroupReference.
 */
// @ts-expect-error
export const getFirelord: GetFirelord = (firestore, ...collectionIDs) => {
	const doc = docCreator(firestore, collectionIDs)
	const collection = collectionCreator(firestore, collectionIDs)
	const collectionGroup = collectionGroupCreator(
		firestore,
		collectionIDs[collectionIDs.length - 1]!
	)
	const or = queryCompositeFilterCreator('or')
	const and = queryCompositeFilterCreator('and')
	return {
		doc,
		collection,
		collectionGroup,
		or,
		and,
	}
}

export type GetFirelord = {
	<T extends MetaType>(
		firestore: Firestore,
		...collectionIDs: GetOddOrEvenSegments<T['collectionPath']>
	): FirelordRef<T>
}

export type FirelordRef<T extends MetaType> = Readonly<{
	/**
	 * Gets a `DocumentReference` instance that refers to the document at the
	 * specified absolute path.
	 *
	 * @param documentIds - all the docID(s) needed to build this document path.
	 * @returns The `DocumentReference` instance.
	 */
	doc: Doc<T>
	/**
	 * Gets a `CollectionReference` instance that refers to the collection at
	 * the specified absolute path.
	 *
	 * @param documentIds - all the docID(s) needed to build this collection path.
	 * @returns The `CollectionReference` instance.
	 */
	collection: Collection<T>
	/**
	 * @returns — The created Query.
	 */
	collectionGroup: () => Query<T>
	/**
	 * Creates a new {@link QueryCompositeFilterConstraint} that is a disjunction of
	 * the given filter constraints. A disjunction filter includes a document if it
	 * satisfies any of the given filters.
	 *
	 * @param queryConstraints - Optional. The list of
	 * {@link QueryFilterConstraint}s to perform a disjunction for. These must be
	 * created with calls to {@link where}, {@link or}, or {@link and}.
	 * @returns The newly created {@link QueryCompositeFilterConstraint}.
	 */
	or: QueryCompositeFilter<T, 'or'>
	/**
	 * Creates a new {@link QueryCompositeFilterConstraint} that is a conjunction of
	 * the given filter constraints. A conjunction filter includes a document if it
	 * satisfies all of the given filters.
	 *
	 * @param queryConstraints - Optional. The list of
	 * {@link QueryFilterConstraint}s to perform a conjunction for. These must be
	 * created with calls to {@link where}, {@link or}, or {@link and}.
	 * @returns The newly created {@link QueryCompositeFilterConstraint}.
	 */
	and: QueryCompositeFilter<T, 'and'>
}>

export {
	getFirestore,
	Timestamp,
	GeoPoint,
	Bytes,
	connectFirestoreEmulator,
} from 'firebase/firestore'

export * from './batch'
export * from './transaction'
export * from './fieldValue'
export * from './listener'
export * from './operations'
export * from './queryConstraints'
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
	WriteBatch,
	RunTransaction,
	AbstractMetaTypeCreator,
	GetDocIds,
	Transaction,
	GetCollectionIds,
} from './types'
