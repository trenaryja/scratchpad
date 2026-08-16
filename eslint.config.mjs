import { defineConfig } from '@trenaryja/config/eslint'

export default [
	...defineConfig(),
	{ ignores: ['convex/_generated/**'] },
	{
		// Import order is handled by VS Code's organize-imports on save.
		rules: { 'perfectionist/sort-imports': 'off' },
	},
	{
		// yjs shared types (Y.Text) are CRDTs — editing them via delete/insert inside
		// ydoc.transact() is the collaborative-editing API, not accidental render-time
		// mutation, and React state cannot stand in for a CRDT.
		files: ['hooks/use-document.ts'],
		rules: { '@eslint-react/immutability': 'off' },
	},
]
