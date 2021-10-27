<!-- markdownlint-disable MD010 -->

# firelordjs(BETA, js only)

[![npm](https://img.shields.io/npm/v/firelordjs)](https://www.npmjs.com/package/firelordjs) [![GitHub](https://img.shields.io/github/license/tylim88/firelordjs)](https://github.com/tylim88/firelordjs/blob/master/LICENSE) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/tylim88/firelordjs/pulls)

🐤 Write truly scalable firestore code with complete deep typing firestore wrapper, no more typing hell in your firestore code.

💪🏻 handle object, array, array object, object array...and all kinds of type, regardless of the nesting level!

🚀 All read and write operation are typed, query field path, field value, collection path, document path, everything is typed!

🔥 Automatically convert all value type to corresponding read type, write type and compare type(good at handling timestamp and field value).

✋🏻 Not only it safeguards your types, but it also stops you from making any incorrect implementation(use the wrapper incorrectly).

✨ Api closely resemble firestore api, low learning curve.

🐉 Zero dependency.

⛲️ Out of box typescript support.

Variants:

1. [react native](https://www.npmjs.com/package/firelordrn)
2. [nodejs](https://www.npmjs.com/package/firelord)

## 🦙 Usage

This is wrapper for [firestore](https://firebase.google.com/docs/firestore/quickstart), you can use firebase v8 or v9

work exactly like [firelord](https://github.com/tylim88/Firelord), except that:

1. any kind of `create` operations is not available, you can only create document using `set` or `add`
2. no `offset`
3. more parameter for `get` and `onSnapshot`

instead of

```ts
// from firelord doc
// don't do this
import { firelord, Firelord } from 'firelord'
import { firestore } from 'firebase-admin'

// create wrapper
const wrapper = firelord(firestore)
```

do

```ts
// do this
import { firelord, Firelord } from 'firelordjs'
// firebase 8
import firebase from 'firebase'
import 'firebase/firestore'

// firebase 9
// import firebase from 'firebase/compat/app'
// import 'firebase/compat/firestore'

firebase.initializeApp({
	apiKey: '### FIREBASE API KEY ###',
	authDomain: '### FIREBASE AUTH DOMAIN ###',
	projectId: '### CLOUD FIRESTORE PROJECT ID ###',
})

const firestore = firebase.firestore

// create wrapper
const wrapper = firelord(firestore)
```

get and onSnapshot

```ts
// import user

// options?:{source: 'default' | 'server' | 'cache'}
user.get(options)

// observer: {
// 	next?: (
// 		snapshot: FirelordFirestore.DocumentSnapshot<Read>
// 	) => void
// 	error?: (error: Error) => void
// },
// options?: { includeMetadataChanges: boolean }
user.onSnapshot(observer, options)
```

no surprise here, everything is similar to firestore api

the rest is exactly the same as [firelord](https://github.com/tylim88/Firelord)
