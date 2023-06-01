import { MetaType } from '../metaTypeCreator'
import { WhereFilterOp, OrderByDirection } from '../alias'
import { CursorType, CursorConstraint } from './cursor'
import { WhereConstraint } from './where'
import { LimitConstraint } from './limit'
import { OrderByConstraint } from './orderBy'
import { QueryCompositeFilterConstraint } from './composite'

type QueryNonFilterConstraints<T extends MetaType> =
	| LimitConstraint<'limit' | 'limitToLast', number>
	| CursorConstraint<CursorType, unknown[]>
	| OrderByConstraint<keyof T['compare'] & string, OrderByDirection | undefined>

export type QueryConstraints<T extends MetaType> =
	| WhereConstraint<T, keyof T['compare'] & string, WhereFilterOp, unknown>
	| QueryNonFilterConstraints<T>

export type QueryFilterConstraints<T extends MetaType> =
	| WhereConstraint<T, keyof T['compare'] & string, WhereFilterOp, unknown>
	| QueryCompositeFilterConstraint<T, 'and' | 'or', QueryFilterConstraints<T>[]>

export type QueryAllConstraints<T extends MetaType> =
	| QueryConstraints<T>
	| QueryCompositeFilterConstraint<T, 'and' | 'or', QueryFilterConstraints<T>[]>
