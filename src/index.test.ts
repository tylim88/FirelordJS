import { getFirelord, MetaTypeCreator } from '.'
import { initializeApp, User } from './utilForTests'
import { getFirestore } from 'firebase/firestore'

initializeApp()
const db = getFirestore()

type parent = MetaTypeCreator<
	{
		a: { b: string; c: boolean }
		d: number
		e: { f: string[] }
	},
	'parent',
	string
>

type Child = MetaTypeCreator<
	{
		a: { b: string; c: boolean }
		d: number
		e: { f: string[] }
	},
	'child',
	string,
	parent
>

describe('test', () => {
	it('test pass', () => {
		;() => {
			getFirelord<User>(db, `topLevel`, `Users`)
			getFirelord<Child>(db, 'parent', 'child')
		}
	})
	it('test incorrect collection', () => {
		;() => {
			getFirelord<User>(
				db,
				// @ts-expect-error
				`topLe1vel`,
				`Users`
			)
			getFirelord<User>(
				db,
				`topLevel`,
				// @ts-expect-error
				`Use1rs`
			)
			getFirelord<Child>(
				db,
				// @ts-expect-error
				'paraent',
				'child'
			).collection('abc')

			getFirelord<Child>(
				db,
				'parent',
				'abc',
				// @ts-expect-error

				'child'
			)
		}
	})
	it('test collection path type', () => {
		;() => {
			getFirelord<User>(db, `topLevel`, `Users`).collection(
				// @ts-expect-error
				'abc'
			)
			const userRef =
				// @ts-expect-error
				getFirelord<User>(db, 'User1s')

			userRef.doc(
				// @ts-expect-error
				123
			)
			userRef.collection(
				// @ts-expect-error
				false
			)
			userRef.collectionGroup(
				// @ts-expect-error
				{}
			)
		}
	})
})
