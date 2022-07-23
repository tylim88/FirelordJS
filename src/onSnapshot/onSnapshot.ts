import { onSnapshot as onSnapshot_ } from 'firebase/firestore'
import {
	OriFirestoreError,
	OriSnapshotListenOptions,
	OriQuery,
	FirestoreError,
	OnSnapshot,
} from '../types'

export const isOptions = (
	arg:
		| ((error: OriFirestoreError) => void)
		| (() => void)
		| OriSnapshotListenOptions
		| undefined
): arg is OriSnapshotListenOptions => {
	const v = arg as Partial<OriSnapshotListenOptions>
	return v?.includeMetadataChanges !== undefined // includeMetadataChanges is boolean, so check for undefined
}

export const onSnapshot: OnSnapshot = (
	reference,
	onNext,
	onError?: ((error: FirestoreError) => void) | OriSnapshotListenOptions,
	options?: OriSnapshotListenOptions
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
