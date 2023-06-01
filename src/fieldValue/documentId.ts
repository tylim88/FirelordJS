import { __name__ } from '../types'

// documentId() no longer play any significant role because you can replace it with string `__name__`
// it is kept for backward compatibility

/**
 * Returns a special sentinel `FieldPath` to refer to the ID of a document.
 * It can be used in queries to sort or filter by the document ID.
 */
export const documentId: () => __name__ = () => '__name__'
