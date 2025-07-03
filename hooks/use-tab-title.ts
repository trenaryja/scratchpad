import { useEffect } from 'react'

export function useTabTitle(title?: string, fallback = 'ScratchPad') {
	useEffect(() => {
		document.title = title?.trim() ? title : fallback
		return () => {
			document.title = fallback
		}
	}, [title, fallback])
}
