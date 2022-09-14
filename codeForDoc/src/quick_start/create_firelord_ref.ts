import { getFirelord, getFirestore } from 'firelordjs'
import { initializeApp } from 'firebase/app'
import { Example } from './define_meta_type'

const app = initializeApp({
	projectId: '### PROJECT ID ###',
})

export const db = getFirestore(app)

export const firelordExample = getFirelord<Example>()

export const example = firelordExample('SomeCollectionName')
