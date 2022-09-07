import { ArrayUnionOrRemove } from './fieldValue'
import { ErrorArrayFieldValueEmpty } from './error'

export type ArrayRemoveOrUnion = <Elements extends unknown[]>(
	...elements: Elements extends [] ? [ErrorArrayFieldValueEmpty] : Elements
) => ArrayUnionOrRemove<Elements[number]>
