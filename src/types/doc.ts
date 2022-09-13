import { DocumentReference } from './refs'
import { MetaType } from './metaTypeCreator'
import { Firestore } from './alias'
import { GetOddOrEvenSegments } from './utils'

export type DocCreator = <T extends MetaType>(
	fStore: Firestore,
	...collectionIDs: string[]
) => Doc<T>

export type Doc<T extends MetaType> = {
	(
		...documentIDs: GetOddOrEvenSegments<T['docPath'], false>
	): DocumentReference<T>
	(
		firestore: Firestore,
		...documentIDs: GetOddOrEvenSegments<T['docPath'], false>
	): DocumentReference<T>
}
