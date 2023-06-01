import { MetaType } from '../metaTypeCreator'
import { Query, CollectionReference } from '../refs'
import { QuerySnapshot } from '../snapshot'

export type GetDocs = <T extends MetaType>(
	query: Query<T> | CollectionReference<T>
) => Promise<QuerySnapshot<T>>
