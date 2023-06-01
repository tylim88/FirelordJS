import { MetaType } from '../metaTypeCreator'
import { DocumentReference } from '../refs'
import { DocumentSnapshot } from '../snapshot'

export type GetDoc = <T extends MetaType>(
	reference: DocumentReference<T>
) => Promise<DocumentSnapshot<T>>
