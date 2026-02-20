import { defineConfig } from '@fullstacksjs/eslint-config'

export default defineConfig({
	ignores: ['convex/_generated/**'],
	files: ['**/*.ts', '**/*.tsx'],
	rules: {
		'@eslint-react/no-missing-context-display-name': 'off',
		'perfectionist/sort-imports': 'off', // handled by vscode organize imports

		'@typescript-eslint/consistent-type-definitions': ['error', 'type'],
		'@typescript-eslint/no-unnecessary-type-assertion': 'error',
		'@typescript-eslint/prefer-nullish-coalescing': 'error',
	},
})
