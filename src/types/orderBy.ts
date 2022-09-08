import { OrderByConstraint } from './queryConstraints'
import { OrderByDirection } from './alias'
import { MetaType } from './metaTypeCreator'

export type OrderBy = <
	T extends MetaType,
	FieldPath extends keyof T['compare'] & string,
	DirectionStr extends OrderByDirection | undefined = undefined
>(
	fieldPath: FieldPath,
	directionStr?: DirectionStr
) => OrderByConstraint<FieldPath, DirectionStr>
