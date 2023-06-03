import { __name__ } from '../types'

/**
 * Returns a special sentinel `FieldPath` to refer to the ID of a document.
 * It can be used in queries to sort or filter by the document ID.
 * documentId() no longer play any significant role because you can replace it with string `__name__`.
 * It is kept for backward compatibility.
 */
export const documentId = (): __name__ => '__name__'
