import {
	MetaTypeCreator,
	WriteBatch,
	DocumentReference,
	AbstractMetaTypeCreator,
	updateDoc,
} from 'firelordjs'

type A = { a: number }
type AbstractMetaType = AbstractMetaTypeCreator<A>
type AB = MetaTypeCreator<A & { b: string }, 'AB'>
type AC = MetaTypeCreator<A & { c: boolean }, 'AC'>

type FirestoreUpdateParams<T extends AbstractMetaType> = {
	batch?: WriteBatch
	ref: DocumentReference<T>
	data: Partial<T['writeFlatten']>
}

export function $firestoreUpdate<T extends AbstractMetaType>({
	batch,
	ref,
	data,
}: FirestoreUpdateParams<T>) {
	const mixin = {
		a: 123,
	}

	const mixedData: Partial<T['writeFlatten']> = {
		...data,
		...mixin,
	}

	if (batch) {
		batch.update(
			ref,
			//@ts-expect-error
			mixedData
		)
		return Promise.resolve()
	}

	return updateDoc(
		ref,
		//@ts-expect-error
		mixedData
	)
}

const b = 1 as unknown as DocumentReference<AB>
const c = 1 as unknown as DocumentReference<AC>

$firestoreUpdate({
	ref: b,
	data: { b: 'Test' },
})
//
$firestoreUpdate({
	ref: c,
	data: { c: false },
})
