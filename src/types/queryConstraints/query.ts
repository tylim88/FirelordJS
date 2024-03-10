import { MetaType, GetAllCompareKeys } from '../metaTypeCreator'
import { WhereFilterOp } from '../alias'
import { CursorType, CursorConstraint } from './cursor'
import { WhereConstraint } from './where'
import { LimitConstraint } from './limit'
import { OrderByConstraint } from './orderBy'
import { QueryCompositeFilterConstraint } from './composite'

type QueryNonFilterConstraints<T extends MetaType> =
	| LimitConstraint<'limit' | 'limitToLast'>
	| CursorConstraint<CursorType, unknown[]>
	| OrderByConstraint<GetAllCompareKeys<T>>

export type QueryConstraints<T extends MetaType> =
	| WhereConstraint<T, GetAllCompareKeys<T>, WhereFilterOp, unknown>
	| QueryNonFilterConstraints<T>

export type QueryFilterConstraints<T extends MetaType> =
	| WhereConstraint<T, GetAllCompareKeys<T>, WhereFilterOp, unknown>
	| QueryCompositeFilterConstraint<T, 'and' | 'or', QueryFilterConstraints<T>[]>

export type QueryAllConstraints<T extends MetaType> =
	| QueryConstraints<T>
	| QueryCompositeFilterConstraint<T, 'and' | 'or', QueryFilterConstraints<T>[]>
