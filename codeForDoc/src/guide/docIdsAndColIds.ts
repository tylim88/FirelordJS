import { MetaType, FirelordRef, GetDocIds, GetCollectionIds } from 'firelordjs'

export async function guardDocIds<T extends MetaType>({
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

export async function guardCollectionIds<T extends MetaType>({
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

export async function guardDocIdsAndCollectionIds<T extends MetaType>({
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
