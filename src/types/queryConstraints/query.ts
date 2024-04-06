import { WhereFilterOp } from '../alias'
import { CursorType, CursorConstraint } from './cursor'
import { WhereConstraint } from './where'
import { LimitConstraint } from './limit'
import { OrderByConstraint } from './orderBy'
import { QueryCompositeFilterConstraint } from './composite'

type QueryNonFilterConstraints =
	| LimitConstraint<'limit' | 'limitToLast'>
	| CursorConstraint<CursorType, unknown[]>
	| OrderByConstraint<string>

export type QueryConstraints =
	| WhereConstraint<string, WhereFilterOp, unknown>
	| QueryNonFilterConstraints

export type QueryFilterConstraints =
	| WhereConstraint<string, WhereFilterOp, unknown>
	| QueryCompositeFilterConstraint<'and' | 'or', QueryFilterConstraints[]>

export type QueryAllConstraints =
	| QueryConstraints
	| QueryCompositeFilterConstraint<'and' | 'or', QueryFilterConstraints[]>
