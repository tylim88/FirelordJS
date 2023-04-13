import { MetaType } from './metaTypeCreator'
import { Firestore } from './alias'
import { CollectionReference } from './refs'
import { GetOddOrEvenSegments } from './utils'
import { IsValidDocIDLoop } from './validID'

export type CollectionCreator = {
	<T extends MetaType>(
		fStore: Firestore,
		collectionIDs: string[]
	): Collection<T>
}

export type Collection<T extends MetaType> = <
	D extends GetOddOrEvenSegments<T['collectionPath'], false>
>(
	...documentIDs: D extends never ? D : IsValidDocIDLoop<D>
) => CollectionReference<T>

export type GetCollectionIds<T extends MetaType> = GetOddOrEvenSegments<
	T['collectionPath'],
	false
>
