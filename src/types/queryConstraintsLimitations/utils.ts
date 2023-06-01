import { WhereFilterOp } from '../alias'
import { IsSame, IsTrue } from '../utils'

export type Equal = '=='
export type Greater = '>'
export type Smaller = '<'
export type GreaterEqual = '>='
export type SmallerEqual = '<='
export type Range = Greater | Smaller | Greater | GreaterEqual | SmallerEqual
export type NotEqual = '!='
export type NotIn = 'not-in'
export type In = 'in'
export type Or = 'or'
export type And = 'and'
export type ArrayContains = 'array-contains'
export type ArrayContainsAny = 'array-contains-any'
export type InequalityOpStr = Range | NotEqual | NotIn
export type ValueOfOptStr = Range | NotEqual | Equal
export type ArrayOfOptStr = In | NotIn
export type ValueOfOnlyArrayOptStr = ArrayContainsAny
export type ElementOfOptStr = ArrayContains
IsTrue<
	IsSame<
		WhereFilterOp,
		| InequalityOpStr
		| ValueOfOptStr
		| ArrayOfOptStr
		| ValueOfOnlyArrayOptStr
		| ElementOfOptStr
	>
>()
