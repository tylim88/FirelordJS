# HISTORY

## v 1.6.5 24-July-2022

- fix direct nested array prevention not working

## v 1.6.4 23-July-2022

- export create (admin only)

## v 1.6.3 23-July-2022

- no longer replace empty array of cursor with unique value as it will affect query result
- if the cursor has 0 argument (empty array rest parameter), it is removed from the query reference instead
- cursor now treat QueryDocumentSnapshot like DocumentSnapshot: if the argument of cursors is QueryDocumentSnapshot, it should be the one and only argument.

## v 1.6.0 22-July-2022

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
