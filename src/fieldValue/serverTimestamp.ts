import { serverTimestamp as serverTimestamp_ } from 'firebase/firestore'
import { ServerTimestampFieldValue } from '../types'

/**
Returns a sentinel used with @firebase/firestore/lite#(setDoc:1) or @firebase/firestore/lite#(updateDoc:1) to include a server-generated timestamp in the written data.
 */
export const serverTimestamp = () => {
	return serverTimestamp_() as unknown as ServerTimestampFieldValue
}
