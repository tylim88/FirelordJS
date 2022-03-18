import { getFirelord } from 'firelordjs'
import { initializeApp } from 'firebase/app'
import { Example } from './dataType'

initializeApp({
	apiKey: '### FIREBASE API KEY ###',
	authDomain: '### FIREBASE AUTH DOMAIN ###',
	projectId: '### CLOUD FIRESTORE PROJECT ID ###',
})

const firelordRef = getFirelord()

export const example = firelordRef<Example>('SomeCollectionName')
