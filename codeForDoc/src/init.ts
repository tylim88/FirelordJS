import { getFirelord, getFirestore } from 'firelordjs'
import { initializeApp } from 'firebase/app'
import { Example } from './dataType'

const app = initializeApp({
	projectId: '### PROJECT ID ###',
})

export const db = getFirestore() // or getFirestore(app), you can skip this line

// Recommendation: Export this if the collection is sub-collection and then fill in collection path later, because sub collection most likely have dynamic document ID.
export const firelordExample = getFirelord<Example>() // or getFirelord<Example>(db)
// then call them using
// const example = firelordExample(`parentCollectionName/${someDocId}/SomeCollectionName`) // this is your firelordRef

// Recommendation: Export this if the collection is root collection
export const example = firelordExample('SomeCollectionName') // this is your firelordRef
