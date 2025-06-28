'use client'

import { useLocalStorage } from './use-local-storage'

type Id = string
type HistoryEntry = { title: string; lastOpened: number }
type History = Record<Id, HistoryEntry>

export function useLocalHistory() {
	const [history, setHistory] = useLocalStorage<History>('history', {})

	const upsert = (id: Id, title: HistoryEntry['title']) =>
		setHistory((prev) => ({ ...prev, [id]: { title, lastOpened: Date.now() } }))

	const remove = (id: string) =>
		setHistory((prev) => {
			const { [id]: _, ...rest } = prev
			return rest
		})
	// {
	// 	console.log(id)
	// 	const { [id]: _, ...rest } = history
	// 	console.log(JSON.stringify(rest, null, 2))
	// }

	return { history, upsert, remove }
}
