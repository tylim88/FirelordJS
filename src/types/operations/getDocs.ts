import { MetaType } from '../metaTypeCreator'
import { GeneralQuery } from '../refs'
import { QuerySnapshot } from '../snapshot'

export type GetDocs = <T extends MetaType>(
	query: GeneralQuery<T>
) => Promise<QuerySnapshot<T>>
