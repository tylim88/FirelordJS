import { MetaType } from '../metaTypeCreator'
import { Query } from '../refs'
import { AggregateQuerySnapshot } from '../snapshot'

export type GetCountFromServer = <T extends MetaType>(
	query: Query<T>
) => Promise<AggregateQuerySnapshot<T>>
