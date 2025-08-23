import { useEffect } from 'react'

export const useTabTitle = (title: string) => {
	useEffect(() => {
		document.title = title.trim()
	}, [title])
}
