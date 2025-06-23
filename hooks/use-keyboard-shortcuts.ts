'use client'

import { useEffect } from 'react'

interface KeyboardShortcutsProps {
	onToggleCommandPalette: () => void
}

export function useKeyboardShortcuts({ onToggleCommandPalette }: KeyboardShortcutsProps) {
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if ((event.ctrlKey || event.metaKey) && (event.key === 'k' || event.key === 'p')) {
				event.preventDefault()
				onToggleCommandPalette()
			}
		}

		document.addEventListener('keydown', handleKeyDown)
		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [onToggleCommandPalette])
}
