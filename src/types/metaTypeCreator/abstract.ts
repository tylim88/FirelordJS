import { MetaTypeCreator } from './metaTypeCreator'
import { MetaType } from './metaType'
import { StrictOmit } from '../utils'

type CommonAbstractProps =
	| 'base'
	| 'write'
	| 'writeFlatten'
	| 'read'
	| 'compare'

export type AbstractMetaTypeCreator<T extends Record<string, unknown>> = Pick<
	MetaTypeCreator<T, '-'>,
	CommonAbstractProps
> &
	StrictOmit<MetaType, CommonAbstractProps>
