import { WhereConstraint } from './queryConstraints'
import { MetaType } from './metaTypeCreator'
import { WhereFilterOp } from './alias'
import { DocumentId, __name__ } from './fieldPath'
import { ErrorWhere__name__ } from './error'
import { Narrow } from './utils'

export type Where = <
	T extends MetaType,
	FieldPath extends (keyof T['writeFlatten'] & string) | DocumentId,
	OpStr extends WhereFilterOp,
	Value
>(
	fieldPath: FieldPath extends __name__ ? ErrorWhere__name__ : FieldPath,
	opStr: OpStr,
	value: Narrow<Value>
) => WhereConstraint<
	T,
	FieldPath extends DocumentId ? __name__ : FieldPath,
	OpStr,
	Value
>
