import { defineConfig } from 'vitest/config'
import { preset } from './vitest.emulator'

export default defineConfig({
	test: {
		...preset,
		root: 'codeForDoc',
	},
})
