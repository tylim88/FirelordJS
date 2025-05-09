import { snapshotEqual as snapshotEqual_ } from 'firebase/firestore'
import { SnapshotEqual } from '../types'

/**
 * Returns true if the provided snapshots are equal.
 *
 * @param left - A snapshot to compare.
 * @param right - A snapshot to compare.
 * @returns true if the snapshots are equal.
 */
// @ts-expect-error
export const snapshotEqual: SnapshotEqual = snapshotEqual_
