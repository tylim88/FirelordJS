import { MetaType } from '../metaTypeCreator'
import { CollectionReference, DocumentReference } from '../refs'

export type AddDoc = <T extends MetaType>(
	reference: CollectionReference<T>,
	data: T['write']
) => Promise<DocumentReference<T>>
