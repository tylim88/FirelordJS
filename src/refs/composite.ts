import { and, or } from 'firebase/firestore'
import { MetaType, And, Or } from '../types'
import { queryBuilder } from './utils'

export const andCreator =
	<T extends MetaType>(): And<T> =>
	(...queryConstraints) => {
		const constraints = queryBuilder(queryConstraints)
		return {
			type: 'and',
			constraints,
			ref: and(...constraints),
		}
	}

export const orCreator =
	<T extends MetaType>(): Or<T> =>
	(...queryConstraints) => {
		const constraints = queryBuilder(queryConstraints)
		return {
			type: 'or',
			constraints,
			ref: or(...constraints),
		}
	}
