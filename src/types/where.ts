import { WhereConstraint } from './constraints'
import { MetaType } from './metaTypeCreator'
import { WhereFilterOp } from './alias'
import { DocumentId, __name__ } from './fieldPath'

export type Where = <
	T extends MetaType,
	FieldPath extends (keyof T['writeFlatten'] & string) | DocumentId,
	OpStr extends WhereFilterOp,
	// eslint-disable-next-line prettier/prettier
	const Value
>(
	fieldPath: FieldPath,
	opStr: OpStr,
	value: Value
) => WhereConstraint<
	T,
	FieldPath extends DocumentId ? __name__ : FieldPath,
	OpStr,
	Value
>
