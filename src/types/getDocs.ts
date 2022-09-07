import { MetaType } from './metaTypeCreator'
import { Query } from './refs'
import { QuerySnapshot } from './snapshot'

export type GetDocs = <T extends MetaType>(
	query: Query<T>
) => Promise<QuerySnapshot<T>>
