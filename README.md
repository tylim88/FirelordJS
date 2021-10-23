<!-- markdownlint-disable MD010 -->

# firelordjs(BETA, NOT for nodejs)

[![npm](https://img.shields.io/npm/v/firelordjs)](https://www.npmjs.com/package/firelordjs) [![GitHub](https://img.shields.io/github/license/tylim88/firelordjs)](https://github.com/tylim88/firelordjs/blob/master/LICENSE) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/tylim88/firelordjs/pulls)

🐤 firestore wrapper with deeper typing solution.

🚀 All read and write operation are typed, field path, field value, collection path, document path, all typed!

🔥 Automatically convert base type to corresponding read and write time(good at handling timestamp and field value).

✨ Api closely resemble firestore api, low learning curve.

🐉 Zero dependency.

⛲️ Out of box typescript support.

## 🦙 Usage

This is wrapper for [firestore](https://firebase.google.com/docs/firestore/quickstart), you must use firebase version v8.x.x

work exactly like [firelord](https://github.com/tylim88/Firelord), except that:

1. any kind of `create` operations is not available, you can only create document using `set` or `add`
2. no `offset`

finally you just need to change the import

instead of

```ts
import { firelord, Firelord } from 'firelord' // don't do this
```

do

```ts
import { firelord, Firelord } from 'firelordjs' // do this
```
