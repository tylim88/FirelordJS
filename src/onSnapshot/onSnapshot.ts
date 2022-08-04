import { onSnapshot as onSnapshot_ } from 'firebase/firestore'
import {
	FirestoreError,
	SnapshotListenOptions,
	OriQuery,
	OnSnapshot,
} from '../types'

export const isOptions = (
	arg:
		| ((error: FirestoreError) => void)
		| (() => void)
		| SnapshotListenOptions
		| undefined
): arg is SnapshotListenOptions => {
	const v = arg as Partial<SnapshotListenOptions>
	return v?.includeMetadataChanges !== undefined // includeMetadataChanges is boolean, so check for undefined
}

export const onSnapshot: OnSnapshot = (
	reference,
	onNext,
	onError?: ((error: FirestoreError) => void) | SnapshotListenOptions,
	options?: SnapshotListenOptions
) => {
	const newOnError = isOptions(onError) ? undefined : onError
	const newOptions = options || (isOptions(onError) ? onError : undefined)

	return newOptions
		? onSnapshot_(reference as OriQuery, newOptions, {
				// @ts-expect-error
				next: onNext,
				error: newOnError,
		  })
		: onSnapshot_(
				reference as OriQuery,
				// @ts-expect-error
				onNext,
				newOnError
		  )
}
