import { refEqual as refEqual_ } from 'firebase/firestore'
import { RefEqual } from '../types'

/**
 * Returns true if the provided references are equal.
 *
 * @param left - A reference to compare.
 * @param right - A reference to compare.
 * @returns true if the references point to the same location in the same
 * Firestore database.
 */
// @ts-expect-error
export const refEqual: RefEqual = refEqual_
