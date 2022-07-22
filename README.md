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
				src="https://img.shields.io/badge/gzipped-6KB-brightgreen"
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
					alt="code coverage"
				/>
			</a>
			&nbsp;
			<a
				href="https://lgtm.com/projects/g/tylim88/Firelordjs/alerts/"
				target="_blank"
			>
				<img
					alt="Total alerts"
					src="https://img.shields.io/lgtm/alerts/g/tylim88/Firelordjs.svg?logo=lgtm&logoWidth=18"
				/>
			</a>
			&nbsp;
			<a
				href="https://lgtm.com/projects/g/tylim88/Firelordjs/context:javascript"
				target="_blank"
			>
				<img
					alt="Language grade: JavaScript"
					src="https://img.shields.io/lgtm/grade/javascript/g/tylim88/Firelordjs.svg?logo=lgtm&logoWidth=18"
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
	<i>Of The VFQAT &#160;&#160;||&#160;&#160; By The VFQAT &#160;&#160;||&#160;&#160; For The VFQAT</i>
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

FirelordJS is the only library that capable of providing insane type safety while exposing almost all the API of the original Firestore SDK.

FirelordJS has:

- The lowest learning curve (API is nearly identical to the original API).
- The lowest technical debt (easiest to revert to the original API).
- The best type safety\*\*.
- The only library that capable of type against runtime errors.
- Effortless solutions for [Firestore quirks](https://firelordjs.com/highlights/about).
- Possibly also the smallest.

It is what you are looking at: the Master of Fire.

Support [@firebase/rules-unit-testing](https://firelordjs.com/tests)

What is tested:

- Development code: check correctness
- Built code: check compiler setting
- Published code are all tested in CI: check package.json entry point

\*\* I am confident it is the best. If you found something better, I will buy you 10 cups of coffee and 100 cups of coffee if you can create something better.

## Contribution

(The lower it goes, the harder it is)

1. For starter, you can refactor files in `src/types` folder, especially `src/types/queryConstraintLimitation.ts`.

2. Simplify type logic and remove dead code.

3. Cache Firebase Tools in Github Action.

4. Utilizing the latest Typescript feature, like [extends Constraints on infer Type Variables](https://devblogs.microsoft.com/typescript/announcing-typescript-4-7/#extends-constraints-on-infer-type-variables) to reduce code length.

5. Improve tests, currently need more cursor and limit tests(simple test that I skipped).

6. You can also work on the [documentation](https://github.com/tylim88/FirelordJSDoc).

7. Looking for a challenge? Then you can try to implement `mandatory field type`:

   - It is a special type that assign (with union) to object member.
   - Members with such type become `required` even in `update` operations(all members in update operations are partial by default).

   Practical usage is something like `updatedAt` member that keep track of document last updated time.

   Basically just turn an optional member into a required member but due to inner complexity, this is not going to be easy.

   If you want to work on this, come to me first to discuss the implementation strategy, I will provide all information you need to carry out this commit.

8. Support tuple and Record<number, unknown> type.

9. Or just spread the word. 🙂

## Related Projects

1. [Firelord](https://github.com/tylim88/Firelord) - Typescript wrapper for Firestore Admin
2. [Firelordrn](https://github.com/tylim88/firelordrn) - Typescript wrapper for Firestore React Native
3. [FireLaw](https://github.com/tylim88/firelaw) - Write Firestore security rule with Typescript, utilizing Firelord type engine.
4. [FireCall](https://github.com/tylim88/FireCall) - Helper Function to write easier and safer Firebase onCall function.
