<!-- markdownlint-disable MD010 -->
<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD041 -->

<div align="center">
		<img src="https://raw.githubusercontent.com/tylim88/Firelord/main/img/ozai.png" width="200px"/>
		<h1>FirelordJS 烈火君JS</h1>
</div>

<div align="center">
		<a href="https://www.npmjs.com/package/firelordjs" target="_blank">
				<img
					src="https://img.shields.io/npm/v/firelordjs"
					alt="Created by tylim88"
				/>
			</a>
			&nbsp;
			<a
				href="https://github.com/tylim88/firelordjs/blob/main/LICENSE"
				target="_blank"
			>
				<img
					src="https://img.shields.io/github/license/tylim88/firelordjs"
					alt="License"
				/>
			</a>
			&nbsp;
			<a
				href="https://www.npmjs.com/package/firelordjs?activeTab=dependencies"
				target="_blank"
			>
				<img
					src="https://img.shields.io/badge/dynamic/json?url=https://api.npmutil.com/package/firelordjs&label=dependencies&query=$.dependencies.count&color=brightgreen"
					alt="dependency count"
				/>
			</a>
			&nbsp;
			<img
				src="https://img.shields.io/badge/gzipped-2.6KB-brightgreen"
				alt="package size"
			/>
			&nbsp;
			<a href="https://github.com/tylim88/Firelordjs/actions" target="_blank">
				<img
					src="https://github.com/tylim88/Firelordjs/workflows/Main/badge.svg"
					alt="github action"
				/>
			</a>
			&nbsp;
			<a href="https://codecov.io/gh/tylim88/Firelordjs" target="_blank">
				<img
					src="https://codecov.io/gh/tylim88/Firelordjs/branch/main/graph/badge.svg"
					alt="code coverage"
				/>
			</a>
			&nbsp;
			<a href="https://github.com/tylim88/Firelordjs/issues" target="_blank">
				<img
					alt="GitHub issues"
					src="https://img.shields.io/github/issues-raw/tylim88/firelordjs"
				></img>
			</a>
			&nbsp;
			<a href="https://snyk.io/test/github/tylim88/FirelordJS" target="_blank">
				<img
					src="https://snyk.io/test/github/tylim88/FirelordJS/badge.svg"
					alt="vulnerabilities"
				/>
			</a>
</div>
<br/>
<div align="center">
		<i>High Precision Firestore Web Typescript Wrapper, Providing Unparalleled Type Safety and Dev Experience</i>
</div>
<br/>
<div align="center">
		<i>Modular, Minuscule, Intuitive, Unopinionated, Craftsmanship, Ultimate, Peaceful, Deep</i>
</div>
<br/>
<div align="center">
	<i>Of The VFQAT &#160;&#160;&#160;&#160;&#160;||&#160;&#160;&#160;&#160;&#160; By The VFQAT &#160;&#160;&#160;&#160;&#160;|| &#160;&#160;&#160;&#160;&#160; For The VFQAT</i>
</div>
<br />
<div align="center">
	<i>Be The Master Of Your Fire, Be Firelord</i>
</div>
<br />
<div align="center">
	<i>Beyond Typing</i>
</div>
<br>
<div align="center">
<a href="https://firelordjs.com/quick_start" target="_blank" style="color:blue"><strong>Doc</strong></a>
</div>
<br/>

v2.6 will focus on improving JSDoc and removing function overloading

# FirelordJS

FirelordJS is the only library capable of providing truly generic type safety while exposing almost all the API of the official Firestore SDK. The goal is to end Firestore typing madness.

Example of how Firelord transforms `ServerTimestamp` type in different operations:

<p align="center">				
	<img
		src="https://github.com/tylim88/FirelordJS/blob/main/img/example.png?raw=true"
		alt="Example of how Firelord handles `ServerTimestamp` type in different operations"
	/>
</p>

FirelordJS:

- Learning curve is the lowest (API is nearly identical to the original API).
- Technical debt is the lowest (easy to revert to the official API).
- Minimum types creation and no type assertion.
- Offers truly generic type safe solutions, declare any data shape.
- Supports deeply nested object type: `Record<string,Record<string,Record<string,...>>>`, max 1000 levels.
- Supports deeply [nested sub collection](https://firelordjs.com/guides/metatype), all children can [track back](https://firelordjs.com/guides/metatype/#know-your-ancestors) all their ancestors type, max 100 generations.
- Generates all possible flatten paths combinations based on your declared type(e.g.: `a`, `a.b`, `a.b.c`, `a.b.d`, `a.x`, `a.x.y`, `a.x.z`) with type safety.
- Generates different types for different operations, see [Transformative Types](https://firelordjs.com/highlights/transformative_types) for complete list of type transformations.
- Package size is the [smallest](https://firelordjs.com/minified_size).
- Doesn't need code generation and schema language, just pure Typescript.
- Supports [@firebase/rules-unit-testing and emulator](https://firelordjs.com/guides/tests), no extra API is needed!
- Is tested beyond source code, we also test built files and published package. (test source code -> build -> test built files -> publish -> test published)
- No mock test, all 250 tests test against live database to ensure the highest certainty.
- Takes care pesky runtime errors like empty array errors([filter](https://firelordjs.com/highlights/where#dealing-with-empty-array-%EF%B8%8F) & [cursors](https://firelordjs.com/highlights/cursor#empty-rest-parameter)) and [implicit data deletion in update operation](https://firelordjs.com/highlights/update#implicit-data-deletion).
- Eliminates the repetitive tasks of writing collections ID and assigning the Firestore instance.
- Blocks undocumented errors and provides over [30 custom error messages](https://github.com/tylim88/FirelordJS/blob/main/src/types/error.ts) to assist you in writing proper Firestore code! Here is an example:
<p align="center">				
	<img
		src="https://github.com/tylim88/FirelordJS/blob/main/img/custom.png?raw=true"
		alt="Example of how Firelord handles `ServerTimestamp` type in different operations"
	/>
</p>

FirelordJS is the only library capable of **[typing against](https://firelordjs.com/highlights/query_rule_typing)** Firestore limitations.

## Bounty

I am confident Firelord is the best among its kind in terms of best safety and developer experience. I stand behind my words, and I will buy you [x cups of coffee](https://www.buymeacoffee.com/) if you:

1. find something better: 200 cups
2. created something better: 2000 cups.

The bounty has been available and keeps increasing since July 14, 2022.

## Nested Composite Query Rulings

(Web version's issue only, admin can skip this section)

Rulings for `or` & `and` composite query are ready, rulings works with nested query, example:

Official SDK runtime error:

<p align="center">				
	<img
		src="https://github.com/tylim88/FirelordJS/blob/main/img/composite2.png?raw=true"
		alt="Example of how Firelord handles `ServerTimestamp` type in different operations"
	/>
</p>

Firelord compile time error:

<p align="center">				
	<img
		src="https://github.com/tylim88/FirelordJS/blob/main/img/composite1.png?raw=true"
		alt="Example of how Firelord handles `ServerTimestamp` type in different operations"
	/>
</p>

It has all the regular rulings plus new composite rulings. See also [peeling composite query error messages](https://firelordjs.com/guides/understanding_error#peeling-composite-query-error-messages)

## Eslint False Errors

Below ESLint rules give false error, please turn them off.

```json
{
	"rules": {
		"@typescript-eslint/no-unsafe-assignment": "off",
		"@typescript-eslint/no-unsafe-call": "off",
		"@typescript-eslint/no-redundant-type-constituents": "off",
		"@typescript-eslint/no-unsafe-return": "off",
		"@typescript-eslint/no-unsafe-member-access": "off"
	}
}
```

## ESM? CommonJS?

(Web version's issue only, admin can skip this section)

FirelordJS built files are a bit complicated. It is not an ESM module(no `"type":"module"` in `package.json`) but it also does not transpile `import` statements to CommonJS.

Results tested with various build tools:

1. (Default) Non ESM with `import` statements (Pseudo ESM)

- ✅ works with [`create-react-app`](https://github.com/facebook/create-react-app)
- ✅ works with [`@vitejs/plugin-react-swc`](https://github.com/vitejs/vite-plugin-react-swc)
- ✅ works with [`@sveltejs/vite-plugin-svelte`](https://github.com/sveltejs/vite-plugin-svelte)
- ✅ works with [`nextjs`](https://github.com/vercel/next.js) with [`next-transpile-modules`](https://github.com/martpie/next-transpile-modules)
- ❌ does not work with [`@sveltejs/kit/vite`](https://github.com/sveltejs/kit)

2. Real ESM (Not available on NPM)

- ✅ works with `@vitejs/plugin-react-swc`
- ✅ works with `@sveltejs/vite-plugin-svelte`
- ✅ works with `nextjs` with `next-transpile-modules`
- ❌ does not work with `create-react-app`, see [issue](https://github.com/facebook/create-react-app/issues/11865)
- ❌ does not work with `@sveltejs/kit/vite` see [issue](https://github.com/sveltejs/kit/issues/612)

3. CommonJS

- ❌ does not work with `create-react-app`
- ❌ does not work with `@vitejs/plugin-react-swc`
- ❌ does not work with `@sveltejs/vite-plugin-svelte`
- ✅ works with `nextjs`.
- ✅ works with `@sveltejs/kit/vite`

Using CommonJS Firelord with Firebase v9.17.0 and beyond break most of the build tools because of this [Firebase issue](https://github.com/firebase/firebase-js-sdk/issues/7135?notification_referrer_id=NT_kwDOAE_D9bI1OTAzNjg1MTE2OjUyMjc1MDk#issuecomment-1518194548)

Pseudo ESM has the highest compatibility which is why it is the default package.
If you see `cannot use import statement outside a module` error, please install the CommonJS version with

```bash
npm i firelordjs@cjs
```

## Types That You Need To Pay Attention To

These are types that are supported but be careful when using them. They are not limitations, but how things work.

### Record<string, something> Support

By design Firelord banned mapped type, this was until version 2.5.10. To understand why mapped was banned in the first place and why it is possible now, see this [issue](https://github.com/tylim88/Firelord/issues/20). In short, querying mapped type requires extra information, make sure you know what you are doing.

### Object Unions Type

Object unions type was banned before v2.6.2 because it brings uncertainty that cannot be handled reasonably. For example, with `{a:number}|{b:string}`, you can set `{a:1}` then update `{b:"x"}`, in this case the type is no longer unions type but an intersection type: `{a:number} & {b:string}`. This limitation is lifted to allow users to fully utilize discriminated unions. Plus in future update operation Mandatory Field could mitigate this problem.

## TO DO

- Mandatory field update. Example, for field like `updatedAt`, it is mandatory to includes it every time you update the document. There are two ways to implement these feature: via Meta Type and via abstraction. With Meta Type(using special field value), it is less flexible because we no longer able to exclude it from all update operations. With abstraction, it is more flexible but require more works from user. I prefer via abstraction due to it does not shut down other use cases despite having lower user experience.

- Support tuple data type.

- Replace `set merge` with `upset`(update if exists, else set). It will receive 1 doc ref argument and 2 data arguments(partial data and complete data). It will attempt to update the document with partial data or create a document with complete data if the document does not exist.

- More in code documentation and tests.

- Add support for V2 Firestore function triggers(for Firelord admin version only).

## Dropped TO DO

- Support for optional (`?` modifier). Optional is a highly requested feature because of how common it is, however because of how Firestore works: it is impossible to query a missing field. Example: it is impossible to query user that has no phone number if phone number field does not exist. Because of this, it is important to make sure every field exists. You may not need the field now, but you may need it later plus adding default value is simple, especially with such powerful typing library like Firelord. So in order to not accidentally cripple your query in the future, I will not implement this feature. Yes, set merge basically lead to the same problem, hence I encourage you to use `upset` instead (will be available in the future).

- Narrow read type base on query constraint. For example `where('a', '==', true)` will narrow the read type of field `a` to `true`, it should be able to narrow down complex case like `where('a.b.c', '==', { d:[{e:1}] })`. Expected to support `==` comparator for all types and _possibly_ `!=` comparator for literal type(type filtering for`!=` comparator poses great complexity hence I may not work on it). Update: I decided to give this up because with the introduction of composite query, it will be extremely difficult to implement this. Plus unlike narrowing down write type, narrowing down the read type does not contribute to type safety, it just makes thing slightly simpler(skip exhaustive check).

## TO FIX

1. Bytes type is not working correctly and is unusable.
2. The rule `You can use at most one array-contains or array-contains-any clause per query. You can't combine array-contains with array-contains-any` is not enabled, see this [release note](https://github.com/tylim88/FirelordJS/releases/tag/2.5.9)
3. The type check of composite query (`or()` / `and()`) value is wrong if the field is `__name__` of collection reference, example: `query(collectionRef, or(where("__name__", "==", "id_only_not_full_path")))` result in false negative because Firelord will ask for full path but we only need full path if the reference is group collection.
4. Significant lag when trying to import anything from the library.

## Trivial

- The name Firelord is a reference to the [Firelord](https://avatar.fandom.com/wiki/Fire_Lord) of Avatar.
- Undocumented releases are README updates.
- [Contributing](https://firelordjs.com/contributing).
- Documentation [Github](https://github.com/tylim88/FirelordJSDoc)

## Related Projects

We are creating the best type safety tool chains for Firebase, and your support helps us make them possible:

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/AcidCoder)

✅ - Tested and production ready  
🚧 - Done but not tested  
📅 - Planning  
✍️ - To Rewrite  
🔨 - To Repurpose (rewrite to do something else)  
🔥 - Maintaining  
🏗️ - Building  
🛑 - On Hold  
❓ - May Discontinue/Cancel

1. [FirelordJS](https://github.com/tylim88/FirelordJS) - Typescript wrapper for Firestore Web. ✅🔥
2. [Firelordrn](https://github.com/tylim88/FirelordRN) - Typescript wrapper for Firestore React Native 🚧❓
3. [Firelord](https://github.com/tylim88/Firelord) - Typescript wrapper for Firestore Admin. ✅🔥
4. [FireSageJS](https://github.com/tylim88/FireSageJS) - Typescript wrapper for Realtime Database Web ✅
5. FireSage - Typescript wrapper for Realtime Database Admin. 📅❓
6. [FireSword](https://github.com/tylim88/Firesword) - (new purpose) Firestore Zod Runtime Validation (Firelord Code First Approach).✅📅🔨
7. [FireLaw](https://github.com/tylim88/FireLaw) - (new purpose) Firestore Security Rules VS Code extension type linter based on Firelord type.🛑📅🔨
8. ??? - Firelord and Firesage Front End Intergration 📅
9. [FireCall](https://github.com/tylim88/FireCall) - Helper Function to write easier and safer Firebase onCall function.✅✍️❓
