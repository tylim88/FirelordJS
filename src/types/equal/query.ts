import { MetaType } from '../metaTypeCreator'
import { Query } from '../refs'

export type QueryEqual = (
	left: Query<MetaType>,
	right: Query<MetaType>
) => boolean
