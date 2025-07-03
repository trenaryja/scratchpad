import convexPlugin from '@convex-dev/eslint-plugin'
import pluginJs from '@eslint/js'
import pluginNext from '@next/eslint-plugin-next'
import pluginReact from 'eslint-plugin-react'
import { globalIgnores } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

/** @type {import('eslint').Linter.Config[]} */
export default [
	globalIgnores(['node_modules', '.next']),
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	...convexPlugin.configs.recommended,
	pluginReact.configs.flat.recommended,
	{
		files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
		languageOptions: { globals: globals.browser },
		settings: { react: { version: 'detect' } },
		rules: {
			'react/react-in-jsx-scope': 'off',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					varsIgnorePattern: '^_',
					argsIgnorePattern: '^_',
					destructuredArrayIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_',
				},
			],
		},
	},
	{
		plugins: {
			'@next/next': pluginNext,
		},
		rules: {
			...pluginNext.configs.recommended.rules,
			...pluginNext.configs['core-web-vitals'].rules,
			'react/no-unescaped-entities': 'off',
		},
	},
	{
		files: ['convex/_generated/**/*.{js,ts,jsx,tsx}'],
		linterOptions: {
			reportUnusedDisableDirectives: false,
		},
	},
]
