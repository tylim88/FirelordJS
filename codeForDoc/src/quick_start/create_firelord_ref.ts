import { getFirelord, getFirestore } from 'firelordjs'
import { initializeApp } from 'firebase/app'
import { Example } from './define_meta_type'

const app = initializeApp({
	projectId: '### PROJECT ID ###',
})

export const db = getFirestore()

export const example = getFirelord<Example>(
	getFirestore(),
	'SomeCollectionName'
)
