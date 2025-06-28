'use client'

import { api } from '@/convex/_generated/api'
import { useMutation, useQuery } from 'convex/react'
import { useCallback, useEffect } from 'react'
import { useDebouncedCallback } from './use-debounced-callback'
import { useLocalHistory } from './use-local-history'

export function useConvexDocument(nanoid: string) {
	const { upsert, remove } = useLocalHistory()

	const document = useQuery(api.documents.getDocument, { nanoid })
	const createDocument = useMutation(api.documents.createDocument)
	const updateDocument = useMutation(api.documents.updateDocument)
	const deleteDocument = useMutation(api.documents.deleteDocument)

	const debouncedUpsert = useDebouncedCallback(upsert, 500)

	useEffect(() => {
		if (document) debouncedUpsert(document.nanoid, document.title)
	}, [document?.nanoid, document?.title, debouncedUpsert])

	const handleUpdate = useCallback(
		async (updates: { title?: string; content?: string }) => {
			if (!document) {
				await createDocument({
					nanoid,
					title: updates.title || 'Untitled Document',
					content: updates.content || '',
				})
			} else {
				await updateDocument({
					nanoid,
					...updates,
				})
			}
			if (updates.title) upsert(nanoid, updates.title)
		},
		[document, createDocument, updateDocument, nanoid, upsert],
	)

	const handleDelete = useCallback(async () => {
		remove(nanoid)
		await deleteDocument({ nanoid })
	}, [deleteDocument, nanoid])

	return {
		document,
		updateDocument: handleUpdate,
		deleteDocument: handleDelete,
		createDocument,
		isLoading: document === undefined,
	}
}
