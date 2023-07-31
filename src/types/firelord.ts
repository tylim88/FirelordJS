import { GetOddOrEvenSegments, EmptyObject } from './utils'
import { MetaType } from './metaTypeCreator'
import {
	Query,
	Doc,
	Collection,
	DocCreator,
	CollectionCreator,
	CollectionGroupCreator,
} from './refs'
import { Firestore } from './alias'
import { And, Or, AndCreator, OrCreator } from './queryConstraints'

type Doc_<T extends MetaType> = {
	doc: Doc<T>
}

type Collection_<T extends MetaType> = {
	collection: Collection<T>
}

type CollectionGroup_<T extends MetaType> = {
	/**
	 *  related documentations:
	 *  - {@link https://firelordjs.com/quick_start/#query query}
	 *  - {@link https://firelordjs.com/quick_start/#onsnapshot onSnapshot}
	 * @returns — The created {@link Query}.
	 */
	collectionGroup: () => Query<T>
}
type Or_<T extends MetaType> = {
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
	or: Or<T>
}

type And_<T extends MetaType> = {
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
	and: And<T>
}

type Creators = {
	docCreator: DocCreator
	collectionCreator: CollectionCreator
	collectionGroupCreator: CollectionGroupCreator
	andCreator: AndCreator
	orCreator: OrCreator
}
export type FirelordRef<
	T extends MetaType,
	H extends Partial<Creators> = Creators
> = (unknown extends H['docCreator'] ? EmptyObject : Doc_<T>) &
	(unknown extends H['collectionCreator'] ? EmptyObject : Collection_<T>) &
	(unknown extends H['collectionGroupCreator']
		? EmptyObject
		: CollectionGroup_<T>) &
	(unknown extends H['andCreator'] ? EmptyObject : And_<T>) &
	(unknown extends H['orCreator'] ? EmptyObject : Or_<T>)

export type GetFirelordShakable = <H extends Partial<Creators>>(
	creators: H
) => GetFirelord<H>

export type GetFirelord<H extends Partial<Creators>> = <T extends MetaType>(
	firestore: Firestore,
	...collectionIDs: GetOddOrEvenSegments<T['collectionPath'], 'Odd'>
) => FirelordRef<T, H>

// ! this will error even though they are doing the same code
// export type GetFirelordShakable = <H extends Partial<Creators>>(
// 	creators: H
// ) => <T extends MetaType>(
// 	firestore: Firestore,
// 	...collectionIDs: GetOddOrEvenSegments<T['collectionPath'], 'Odd'>
// ) => FirelordRef<T, H>
