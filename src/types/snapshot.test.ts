import { IsTrue, IsSame } from './utils'
import { DocumentSnapshot } from './snapshot'
import { SnapshotMetadata } from './alias'
import { User } from '../utilForTests'

const documentSnapshot = 1 as unknown as DocumentSnapshot<User>
it('test return data type', () => {
	;() => {
		const data = documentSnapshot.data()
		if (data) {
			/*  eslint-disable unused-imports/no-unused-vars */
			const {
				beenTo,
				name,
				role,
				age,
				a: {
					b: {
						c,
						f,
						// @ts-expect-error
						p,
					},
				},
				// @ts-expect-error
				unknown,
			} = data
			/*  eslint-enable unused-imports/no-unused-vars */
		}
	}
})
it('test exists type', () => {
	;() => {
		const target = documentSnapshot.exists()
		type A = typeof target
		type B = boolean
		IsTrue<IsSame<A, B>>()
	}
})
it('test snapshot metadata type', () => {
	;() => {
		const target = documentSnapshot.metadata
		type A = typeof target
		type B = SnapshotMetadata
		IsTrue<IsSame<A, B>>()
	}
})
it('test data type', () => {
	;() => {
		const target = documentSnapshot.data()
		type A = typeof target
		type B = User['read'] | undefined
		IsTrue<IsSame<A, B>>()
	}
})
it('test get type', () => {
	;() => {
		const target = documentSnapshot.get('a.k')
		type A = typeof target
		type B = User['read']['a']['k'] | undefined
		IsTrue<IsSame<A, B>>()
	}
})
