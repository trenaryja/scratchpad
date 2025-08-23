import convexPlugin from '@convex-dev/eslint-plugin'
import { FlatCompat } from '@eslint/eslintrc'
import { globalIgnores } from 'eslint/config'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
	baseDirectory: __dirname,
})

/** @type {import('eslint').Linter.Config[]} */
const configs = [
	globalIgnores(['node_modules', '.next', 'convex/_generated', 'next-env.d.ts']),
	...compat.extends('next/core-web-vitals', 'next/typescript'),
	...convexPlugin.configs.recommended,
	{
		rules: {
			'react/no-unescaped-entities': 'off',
			// 'react/react-in-jsx-scope': 'off',
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
]

export default configs
