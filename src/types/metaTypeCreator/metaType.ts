export type MetaType = {
	collectionPath: string
	collectionID: string
	docID: string
	docPath: string
	read: Record<string, unknown>
	write: Record<string, unknown>
	writeMerge: Record<string, unknown>
	writeFlatten: Record<string, unknown>
	compare: Record<string, unknown>
	base: Record<string, unknown>
	parent: MetaType | null
	ancestors: MetaType[]
}
