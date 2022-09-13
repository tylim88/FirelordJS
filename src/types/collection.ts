import { MetaType } from './metaTypeCreator'
import { Firestore } from './alias'
import { CollectionReference } from './refs'
import { GetOddOrEvenSegments } from './utils'

export type CollectionCreator = {
	<T extends MetaType>(
		fStore: Firestore,
		...collectionIDs: string[]
	): Collection<T>
}

export type Collection<T extends MetaType> = {
	(
		firestore: Firestore,
		...docIDs: GetOddOrEvenSegments<T['collectionPath'], false>
	): CollectionReference<T>
	(
		...docIDs: GetOddOrEvenSegments<T['collectionPath'], false>
	): CollectionReference<T>
}
