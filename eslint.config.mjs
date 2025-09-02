import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({
	baseDirectory: import.meta.url,
})

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
	{ ignores: ['.next/**', 'next-env.d.ts', 'convex/_generated'] },
	...compat.extends('next/core-web-vitals', 'next/typescript'),
	{
		rules: {
			'react/no-unescaped-entities': 'off',
			'@next/next/no-img-element': 'off',
			'@typescript-eslint/no-namespace': 'off',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{ argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
			],
		},
	},
]

export default eslintConfig
