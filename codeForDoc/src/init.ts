import { getFirelord, getFirestore } from 'firelordjs'
import { initializeApp } from 'firebase/app'
import { Example } from './dataType'

const app = initializeApp({
	projectId: '### PROJECT ID ###',
})

export const db = getFirestore()

export const firelordExample = getFirelord<Example>()

export const example = firelordExample('SomeCollectionName')
