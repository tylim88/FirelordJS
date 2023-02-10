import {
	MetaTypeCreator,
	DocumentReference,
	AbstractMetaTypeCreator,
	updateDoc,
	ServerTimestamp,
	serverTimestamp,
} from 'firelordjs'

type A = { updatedAt: ServerTimestamp }
type AbstractMetaType = AbstractMetaTypeCreator<A>
type AB = MetaTypeCreator<A & { b: string }, 'AB'>
type AC = MetaTypeCreator<A & { c: boolean }, 'AC'>

type FirestoreUpdateParams<T extends AbstractMetaType> = {
	ref: DocumentReference<T>
	data: Partial<T['writeFlatten']>
}

export function $firestoreUpdate<T extends AbstractMetaType>({
	ref,
	data,
}: FirestoreUpdateParams<T>) {
	const mixin: A = {
		updatedAt: serverTimestamp(),
	}

	// it is not safe enough to type object with spread operator because spread does not trigger excess property check https://stackoverflow.com/questions/59318739/is-there-an-option-to-make-spreading-an-object-strict
	// what you want to do is make sure 'mixin' type is correct
	const mixedData = {
		...data,
		...mixin,
	}

	return updateDoc(
		ref,
		//@ts-expect-error
		mixedData
	)
}

const b = 1 as unknown as DocumentReference<AB> // assume this is doc ref
const c = 1 as unknown as DocumentReference<AC> // assume this is doc ref

$firestoreUpdate({
	ref: b,
	data: { b: 'Test' },
})

$firestoreUpdate({
	ref: c,
	data: { c: false },
})
