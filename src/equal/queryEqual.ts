import { queryEqual as queryEqual_ } from 'firebase/firestore'
import { QueryEqual } from '../types'

/**
 * Returns true if the provided queries point to the same collection and apply
 * the same constraints.
 *
 * @param left - A `Query` to compare.
 * @param right - A `Query` to compare.
 * @returns true if the references point to the same location in the same
 * Firestore database.
 */
// @ts-expect-error
export const queryEqual: QueryEqual = queryEqual_
