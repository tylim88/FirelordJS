import { MetaType } from '../metaTypeCreator'
import { GeneralQuery } from '../refs'
import { AggregateQuerySnapshot } from '../snapshot'

export type GetCountFromServer = <T extends MetaType>(
	query: GeneralQuery<T>
) => Promise<AggregateQuerySnapshot<T>>
