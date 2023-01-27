# HISTORY

## 2.2.1 28-Jan-2023

- add `AbstractMetaTypeCreator` to make abstracting meta type easier, see use case https://github.com/tylim88/FirelordJS/issues/90
- expose DocumentData type
- no longer export byte type (admin)

## 2.2.0 27-Jan-2023

- allow all `update` operations and `set merge` to accept value with optional type, this sacrificed some granularity because of how `exactOptionalPropertyTypes` works(but is trivial), also added minimum related tests
- must turn on`exactOptionalPropertyTypes` in tsconfig
- expose `RunTransaction` and `WriteBatch` types

## 2.1.9 4-Sept-2022

- fixed `cannot read properties of null (reading 'FirelordArrayFieldValue')` https://github.com/tylim88/Firelord/issues/13

## 2.1.3 22-Sept-2022

- fixed support for geo point, bytes and Document Reference
- this is a non breaking monkey patch

## 2.1.1 19-Sept-2022

- fixed and improved tests at `queryClauses/index.test.ts`
- admin can now use `offset` clause

## 2.1.0 19-Sept-2022

- fix incorrect `id`, `path`, and `parent` types of collection reference
- narrow the `id` type of document reference
- add more tests and more code for doc
- remove offset prop of collection reference(admin)

## 2.0.0 15-Sept-2022

- new way to declare firelord ref
- new interface for doc, collection and collection group
- this is a big change, please read documentation for more details
- add check for InvalidID (Cannot match the regular expression `__.*__`)

## 1.7.5 15-Sept-2022

- (admin) firebase-admin is now a peerDependency(was a dependency)

## 1.7.4 8-Sept-2022

- reduce compiled size
- further simplify typing
- update eslint

## 1.7.0 7-Sept-2022

important updates

- fix missing in code documentation
- housekeeping in code documentation
- refactor types
- add new argument TransactionOptions to runTransaction
- add peerDependencies field to package.json
- remove the need of crypto module (this module may causes a lot of issues because it is a nodejs module)

## 1.6.6 27-July-2022

- replace Query<T> | CollectionReference<T> with Query<T>

## 1.6.5 24-July-2022

- fix direct nested array prevention not working

## 1.6.4 23-July-2022

- export create (admin only)

## 1.6.3 23-July-2022

- no longer replace empty array of cursor with unique value as it will affect query result
- if the cursor has 0 argument (empty array rest parameter), it is removed from the query reference instead
- cursor now treat QueryDocumentSnapshot like DocumentSnapshot: if the argument of cursors is QueryDocumentSnapshot, it should be the one and only argument.

## 1.6.0 22-July-2022

- cursor now will not accept empty argument
- cursor now handle empty argument in runtime

## v1.5.0 19-July-2022

- rename setting `allFieldsPossiblyUndefined` as `allFieldsPossiblyReadAsUndefined`
- remove onSnapshot onCompletion parameter

## v1.3.0 6-May-2022

- orderBy('\_name') cursor now only accept full doc path, if input type is string, require const assertion or else display "Please use const assertion" error message.

## v1.2.1 6-May-2022

- fix cursor runtime not usable bug https://github.com/tylim88/Firelordjs/issues/51

## v1.2.0 5-May-2022

- fix cursor not able to use with query document snapshot and document snapshot https://github.com/tylim88/Firelordjs/issues/51

## v1.1.6 15-April-22

- rename `PartialNoUndefinedAndNoUnknownMember` to `PartialNoUndefinedAndNoUnknownMemberNoEmptyMember`
- add `AllowEmptyMember` option to `PartialNoUndefinedAndNoUnknownMemberNoEmptyMember`
- remove firebase as peer dependency

## v1.1.3 14-April-22

- expose `PartialNoUndefinedAndNoUnknownMember`

## v1.1.2 13-April-22

- @firebase/rules-unit-testing is now supported and tested.
- expose `FirelordRef`

## v1.1.1 12-April-22

- gradually add support for @firebase/rules-unit-testing, stage 1

## v1.1.0 10-April-22

- MetaType now able to refer to itself, CollectionReference Parent props no longer need type casting

## v1.0.9 30-Mars-22

- fix the type logic of deleteField, merge set now able to use deleteField on nested fields

## v1.0.8 30-Mars-22

- where clause stop fresh empty array for 'in', 'not-in', and 'array-contains-any' filter
- clean some dead logics

## v1.0.7 29-Mars-22

- implement after published test to check if the new version npm package is really working

## v1.0 26-Mar-22

V1.0 released

[Change log before v1.0](https://github.com/tylim88/Firelord/blob/main/CHANGELOG.md)
