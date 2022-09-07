import { OrderByConstraint } from './queryConstraints'
import { OrderByDirection } from './alias'
import { MetaType } from './metaTypeCreator'

export type OrderBy = <
	T extends MetaType,
	FieldPath extends keyof T['compare'] & string,
	DirectionStr extends OrderByDirection | undefined = undefined
>(
	fieldPath: FieldPath extends never ? FieldPath : FieldPath,
	directionStr?: DirectionStr extends never ? DirectionStr : DirectionStr
) => OrderByConstraint<FieldPath, DirectionStr>
