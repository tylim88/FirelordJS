import {
	MetaType,
	FirelordRef,
	GetDocIds,
	GetCollectionIds,
	getFirestore,
	MetaTypeCreator,
	getFirelord,
} from 'firelordjs'

const db = getFirestore()

type abc = MetaTypeCreator<
	{
		a: number
	},
	'SomeCollectionName'
>

const firelordRef = getFirelord<abc>(db, 'SomeCollectionName')

// abstract doc ids
export async function abstractDocIds<T extends MetaType>({
	firelordRef,
	docIds,
}: {
	firelordRef: FirelordRef<T>
	docIds: GetDocIds<T>
}): Promise<void> {
	const docRef = firelordRef.doc(
		// @ts-expect-error
		...docIds
	)
}

// abstract collection ids
export async function abstractCollectionIds<T extends MetaType>({
	firelordRef,
	collectionIds,
}: {
	firelordRef: FirelordRef<T>
	collectionIds: GetCollectionIds<T>
}): Promise<void> {
	const collectionRef = firelordRef.collection(
		// @ts-expect-error
		...collectionIds
	)
}

// abstract both document and collection ids
// The collection ids is basically document ids with the last element removed
// so you can just reuse the document Ids here
export async function abstractDocIdsAndCollectionIds<T extends MetaType>({
	firelordRef,
	docIds,
}: {
	firelordRef: FirelordRef<T>
	docIds: GetDocIds<T>
}): Promise<void> {
	const docRef = firelordRef.doc(
		// @ts-expect-error
		...docIds
	)
	const collectionIds = [...docIds].pop()
	const collectionRef = firelordRef.collection(
		// @ts-expect-error
		...collectionIds
	)
}

// Example of calling it
abstractDocIdsAndCollectionIds({ firelordRef, docIds: ['abc'] })
