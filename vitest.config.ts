import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		include: ['src/**.test.ts', 'npx/**.test.ts'],
		coverage: {
			enabled: true,
			include: ['src/**', 'npx/**'],
			exclude: [...(configDefaults.coverage.exclude || []), '**/index.ts'],
		},
	},
})
