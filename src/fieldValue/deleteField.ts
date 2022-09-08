import { deleteField as deleteField_ } from 'firebase/firestore'
import { DeleteField } from '../types'

/**
 * Returns a sentinel for use with {@link @firebase/firestore/lite#(updateDoc:1)} or
 * {@link @firebase/firestore/lite#(setDoc:1)} with `{merge: true}` to mark a field for deletion.
 */
// @ts-expect-error
export const deleteField: () => DeleteField = deleteField_
