import { defineConfig } from 'vitest/config'

export const preset = {
	environment: 'jsdom',
	coverage: { enabled: true },
	globals: true,
	include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
	// include: ['src/refs/or.test.ts'],
	watch: false,
}

export default defineConfig({
	test: { ...preset },
})
