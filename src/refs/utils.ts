import { QueryAllConstraints, MetaType, QueryFilterConstraints } from '../types'

export const buildPathFromColIDsAndDocIDs = ({
	collectionIDs,
	documentIDs,
}: {
	collectionIDs: string[]
	documentIDs: string[]
}) => {
	return collectionIDs.reduce((acc, collectionId, index) => {
		const documentID = documentIDs[index] ? `${documentIDs[index]}/` : ''
		return `${acc}${collectionId}/${documentID}`
	}, '')
}

export const queryBuilder = (
	queryConstraints:
		| QueryAllConstraints<MetaType>[]
		| QueryFilterConstraints<MetaType>[]
) =>
	// @ts-expect-error
	queryConstraints.reduce((acc, qc) => {
		const type = qc.type
		;(['startAt', 'startAfter', 'endAt', 'endBefore'].includes(type)
			? qc.values.length > 0
			: true) && acc.push(qc.ref)

		return acc
	}, [])
