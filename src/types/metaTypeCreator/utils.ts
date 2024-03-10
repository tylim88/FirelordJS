import { MetaType } from './metaType'

// TODO add tests!
export type GetAllCompareKeys<T extends MetaType> =
	(T['compare'] extends infer T ? (T extends T ? keyof T : never) : never) &
		string
