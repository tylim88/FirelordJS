import { DocumentReference, CollectionReference } from './refs'
import { MetaType } from './metaTypeCreator'
import { Firestore } from './alias'
import { GetOddOrEvenSegments } from './utils'
import { IsValidDocIDLoop } from './validID'
import { ErrorAutoIdTypeMustBeWideString } from './error'

export type DocCreator = <T extends MetaType>(
	fStore: Firestore,
	collectionIDs: string[]
) => Doc<T>

export type Doc<T extends MetaType> = {
	<D extends GetOddOrEvenSegments<T['docPath'], false>>(
		...documentIDs: D extends never ? D : IsValidDocIDLoop<D>
	): DocumentReference<T>
	(
		CollectionReference: string extends T['docID']
			? CollectionReference<T>
			: ErrorAutoIdTypeMustBeWideString<T['docID']>
	): DocumentReference<T>
}
