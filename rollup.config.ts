import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'

export default {
	input: 'src/index.ts',
	output: {
		dir: 'dist',
		format: 'es',
	},
	plugins: [
		typescript({
			tsconfig: 'tsconfig.prod.json',
		}),
		terser(),
	],
	external: ['firebase/firestore'],
}
