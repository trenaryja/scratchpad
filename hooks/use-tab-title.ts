import { useEffect } from 'react'

export function useTabTitle(title: string) {
	useEffect(() => {
		document.title = title.trim()
	}, [title])
}
