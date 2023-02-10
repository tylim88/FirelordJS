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
				src="https://img.shields.io/badge/gzipped-2.5KB-brightgreen"
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
		<i>Extremely High Precision Typescript Wrapper for Firestore Web, Providing Unparalleled Type Safe and Dev Experience</i>
</div>
<br/>
<div align="center">
		<i>Modular, Minuscule, Intuitive, Unopinionated, Craftsmanship, Ultimate, Peaceful, Deep</i>
</div>
<br/>
<div align="center">
	<i>Of The VFQAT &#160;&#160;&#160;&#160;||&#160;&#160;&#160;&#160; By The VFQAT &#160;&#160;&#160;&#160;||&#160;&#160;&#160;&#160; For The VFQAT</i>
</div>
<br />
<div align="center">
	<i>End Firestore Typing Madness</i>
</div>
<br />
<div align="center">
<a href="https://firelordjs.com/quick_start" target="_blank" style="color:blue"><strong>Documentation</strong></a>
</div>

<br/>

FirelordJS is the only library capable of providing insane type safety while exposing almost all the API of the official Firestore SDK.

FirelordJS:

- Has the lowest learning curve (API is nearly identical to the original API).
- Has the lowest technical debt (easy to revert to the official API).
- Offer truly and most generic type safe solutions.
- **Is the only library capable of [typing against](https://firelordjs.com/highlights/query_rule_typing) Firestore limitations**.
- Offer Effortless solutions for [Firestore quirks](https://firelordjs.com/highlights/about).
- Has The smallest package size.

Support [@firebase/rules-unit-testing and emulator](https://firelordjs.com/guides/tests)

I am confident it has the best type safe and nothing come close. I put money on my words and I will buy you [x cups of coffee](https://www.buymeacoffee.com/) if you:

1. found something better: 75 cups
2. created something better: 1000 cups (you don't need to a make full fledge library, something that is minimally better is enough, open an issue if you want to take this challenge)

FirelordJS is thoroughly tested, FirelordJS tests source code, built files and published package.

## Trivial

- The name Firelord is a reference to the [Firelord](https://avatar.fandom.com/wiki/Fire_Lord) of Avatar.

## Contributing

Read [here](https://firelordjs.com/contributing)

## Related Projects

1. [Firelord](https://github.com/tylim88/Firelord) - Typescript wrapper for Firestore Admin
2. [FireSword](https://github.com/tylim88/firesword) - Filter Firestore and RTDB Unknown Keys.
3. [FireCall](https://github.com/tylim88/FireCall) - Helper Function to write easier and safer Firebase onCall function.
4. [FireSageJS](https://github.com/tylim88/FireSageJS) - Typescript wrapper for Realtime Database

Be the master of fire, be Firelord.

## Upcoming V3

V3 focus on codebase overhaul, hopefully with further improved code quality, potential contributor will find it easier to work with.

Code Quality Improvements:

- Simpler type logics.
- Implement latest TS features.
- Better file and folder structure.
- Remove trivial APIs.
- More Tests.
- New Documentation.

New Features:

- Auto narrow to literal type, remove the need to [manually assert as const](https://firelordjs.com/highlights/where).
- Narrow read type base on query constraint. For example `where('a', '==', true)` will narrow the read type of field `a` to `true`.
- Mandatory field update. Example, for field like `updatedAt`, it is mandatory to includes it every time you update the document. There are two ways to implement these feature: via Meta Type and via abstraction. With Meta Type(using special field value), it is less flexible because we no longer able to exclude it from all update operations. With abstraction, it is more flexible but require more works from user. I prefer via abstraction due to it does not shut down other use cases despite having lower user experience.
- Support wide numeric key and wide string key (Record<number, unknown> and Record<string, unknown>). It still needs more consideration because this data type is pointless to query(we need to know what the key is first, it would be better to just save the document ID somewhere) and we need to constantly aware of the document size limit. If you don't care about query and you sure that the size limit will not exceed 1 MB, then this is for you. But allowing this also open up for mistake and bad practice for those who are not aware. Most likely I will not implement this.
