import { getFirelord, getFirestore } from 'firelordjs'
import { initializeApp } from 'firebase/app'
import { Example } from './dataType'

const app = initializeApp({
	projectId: '### PROJECT ID ###',
})

export const db = getFirestore(app)

export const example = getFirelord<Example>(db, 'SomeCollectionName')
