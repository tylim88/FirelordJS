import { __name__ } from '../types'

/**
 * Returns a special sentinel `FieldPath` to refer to the ID of a document.
 * It can be used in queries to sort or filter by the document ID.
 */
export const documentId: () => __name__ = () => '__name__'
