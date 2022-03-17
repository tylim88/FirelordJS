import { getFirelord } from 'firelordjs'
import { getFirestore } from 'firebase/firestore'
import { initializeApp } from 'firebase/app'
import { Example } from './dataType'

initializeApp({
	apiKey: '### FIREBASE API KEY ###',
	authDomain: '### FIREBASE AUTH DOMAIN ###',
	projectId: '### CLOUD FIRESTORE PROJECT ID ###',
})

export const db = getFirestore()

const firelordRef = getFirelord(db)

export const example = firelordRef<Example>('SomeCollectionName')
