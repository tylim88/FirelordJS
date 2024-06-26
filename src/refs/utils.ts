import { QueryAllConstraints, QueryFilterConstraints } from '../types'

export const buildPathFromColIDsAndDocIDs = ({
	collectionIDs,
	documentIDs,
}: {
	collectionIDs: string[]
	documentIDs: string[]
}) => {
	return collectionIDs
		.reduce((acc, collectionId, index) => {
			const documentID = documentIDs[index] ? `${documentIDs[index]}/` : ''
			return `${acc}${collectionId}/${documentID}`
		}, '')
		.slice(0, -1)
}

export const queryBuilder = (
	queryConstraints: QueryAllConstraints[] | QueryFilterConstraints[]
) =>
	queryConstraints.reduce((acc, qc) => {
		const type = qc.type
		;(['startAt', 'startAfter', 'endAt', 'endBefore'].includes(type)
			? // @ts-expect-error
			  qc.values.length > 0
			: // @ts-expect-error
			  true) && acc.push(qc.ref)

		return acc
	}, [])
