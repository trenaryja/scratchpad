'use client'
import { useCallback } from 'react'
import { useLocalStorage } from './use-local-storage'

interface CachedDocument {
	id: string
	title: string
	lastModified: number
}

export function useDocumentCache() {
	const [documents, setDocuments] = useLocalStorage<CachedDocument[]>('document-cache', [])

	const addDocument = useCallback(
		(id: string, title: string) => {
			setDocuments((prev) => {
				const existing = prev.find((doc) => doc.id === id)
				const now = Date.now()

				if (existing) {
					if (existing.title !== title)
						return prev.map((doc) => (doc.id === id ? { ...doc, title, lastModified: now } : doc))
					return prev
				}
				return [...prev, { id, title, lastModified: now }]
			})
		},
		[setDocuments],
	)

	const hideDocument = useCallback(
		(id: string) => {
			setDocuments((prev) => prev.filter((doc) => doc.id !== id))
		},
		[setDocuments],
	)

	return {
		documents,
		addDocument,
		hideDocument,
	}
}
