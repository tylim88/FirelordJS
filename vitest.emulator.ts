import { defineConfig } from 'vitest/config'
import { preset as preset_ } from './vitest.config'

export const preset = {
	...preset_,
	include: ['src/emulator.test.ts', 'src/rulesUnitTesting.test.ts'],
	exclude: [],
}

export default defineConfig({
	test: preset,
})
