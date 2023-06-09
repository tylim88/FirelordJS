import { and, or } from 'firebase/firestore'
import { AndCreator, OrCreator } from '../types'
import { queryBuilder } from './utils'

export const andCreator: AndCreator =
	() =>
	(...queryConstraints) => {
		const constraints = queryBuilder(queryConstraints)
		return {
			type: 'and',
			constraints,
			ref: and(...constraints),
		}
	}

export const orCreator: OrCreator =
	() =>
	(...queryConstraints) => {
		const constraints = queryBuilder(queryConstraints)
		return {
			type: 'or',
			constraints,
			ref: or(...constraints),
		}
	}
