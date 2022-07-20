import { serverTimestamp as serverTimestamp_ } from 'firebase/firestore'
import { ServerTimestamp, serverTimestampSymbol } from '../types'

/**
Returns a sentinel used with @firebase/firestore/lite#(setDoc:1) or @firebase/firestore/lite#(updateDoc:1) to include a server-generated timestamp in the written data.
 */
export const serverTimestamp = () => {
	const ref = serverTimestamp_() as ServerTimestamp
	ref['Firelord.FieldValue'] = serverTimestampSymbol
	return ref
}
