# HISTORY

Change log

## 0.3.13 27-Oct-2021

- <`offset`> and <`limit` and `limit to last`> are now guarantee to chain once.

## 0.3.12 27-Oct-2021

- simplify queryCreator code

## 0.3.11 27-Oct-2021

- fix orderBy chain-able but no real effect
- preventing user from chain `offset` after `offset`(reduce mistake, however cannot guarantee there is only 1 offset till the end of chain).
- preventing user from chain `limit` or `limit to last` after `limit` or `limit to last`(reduce mistake, however cannot guarantee there is only 1 limit or limit to last till the end of chain).
- fix "Type instantiation is excessively deep and possibly infinite", cause is known but found no explanation for this.
- fix recursive type become `any` after declaration is emitted, that causing the build file query type is not working(becoming un-chain-able, a lot of works done to fix this).

## 0.3.2 26-Oct-2021

fix `CheckObjectHasDuplicateEndName` not exported bug

## 0.3.0 26-Oct-2021

- now support object type(important upgrade, lot of thing added)
- now all base type members are required, no more partial
- update and set with merge now reject data with stranger member
- fix forgot to export type

## 0.2.0 24-Oct-2021

- add options parameter to `get` and `onSnapshot`

## 0.1.0 24-Oct-2021

- fix orderBy clause not exist when order with different field name than where clause with "==" or "in" comparator
- fix bug, replace type "=" with "=="

## 0.0.0 15-Oct-2021

-released(beta)
