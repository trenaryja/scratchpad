'use client'

import { useCallback, useState, useEffect, useRef } from 'react'
import { useDocumentCache } from './use-document-cache'
import { convexApi, safeUseQuery, safeUseMutation, isConvexAvailable } from '@/lib/convex-client'

interface Document {
	nanoid: string
	title: string
	content: string
	createdAt: number
	modifiedAt: number
}

export function useConvexDocument(nanoid: string) {
	const { addDocument } = useDocumentCache()
	const [localDocument, setLocalDocument] = useState<Document | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const hasAddedToCache = useRef(false)

	// Convex hooks - safe to call even when Convex not available
	const document = safeUseQuery(
		isConvexAvailable() ? convexApi.documents.getDocument : null,
		isConvexAvailable() ? { nanoid } : 'skip',
	)
	const createDocument = safeUseMutation(isConvexAvailable() ? convexApi.documents.createDocument : null)
	const updateDocument = safeUseMutation(isConvexAvailable() ? convexApi.documents.updateDocument : null)

	// Initialize local document when Convex not available
	useEffect(() => {
		if (!isConvexAvailable()) {
			const stored = localStorage.getItem(`document-${nanoid}`)
			if (stored) {
				try {
					const doc = JSON.parse(stored)
					setLocalDocument(doc)
					if (!hasAddedToCache.current) {
						addDocument(doc.nanoid, doc.title)
						hasAddedToCache.current = true
					}
				} catch (error) {
					console.error('Failed to parse stored document:', error)
				}
			} else {
				// Create new document
				const newDoc: Document = {
					nanoid,
					title: 'Untitled Document',
					content: '# Welcome\n\nStart editing this document...',
					createdAt: Date.now(),
					modifiedAt: Date.now(),
				}
				setLocalDocument(newDoc)
				localStorage.setItem(`document-${nanoid}`, JSON.stringify(newDoc))
				if (!hasAddedToCache.current) {
					addDocument(newDoc.nanoid, newDoc.title)
					hasAddedToCache.current = true
				}
			}
			setIsLoading(false)
		}
	}, [nanoid]) // Remove addDocument from dependencies

	// Handle Convex document loading
	useEffect(() => {
		if (isConvexAvailable()) {
			if (document !== undefined) {
				setIsLoading(false)
				if (document && !hasAddedToCache.current) {
					addDocument(document.nanoid, document.title)
					hasAddedToCache.current = true
				}
			}
		}
	}, [document]) // Remove addDocument from dependencies

	// Reset cache flag when nanoid changes
	useEffect(() => {
		hasAddedToCache.current = false
	}, [nanoid])

	const handleUpdate = useCallback(
		async (updates: { title?: string; content?: string }) => {
			try {
				if (isConvexAvailable() && createDocument && updateDocument) {
					// Use Convex
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
				} else {
					// Fallback to localStorage
					const currentDoc = localDocument || {
						nanoid,
						title: 'Untitled Document',
						content: '',
						createdAt: Date.now(),
						modifiedAt: Date.now(),
					}

					const updatedDoc = {
						...currentDoc,
						...updates,
						modifiedAt: Date.now(),
					}

					setLocalDocument(updatedDoc)
					localStorage.setItem(`document-${nanoid}`, JSON.stringify(updatedDoc))
				}

				// Update local cache for sidebar (only for title changes)
				if (updates.title) {
					addDocument(nanoid, updates.title)
				}
			} catch (error) {
				console.error('Failed to update document:', error)
			}
		},
		[document, localDocument, createDocument, updateDocument, addDocument, nanoid],
	)

	const finalDocument = isConvexAvailable() ? document : localDocument

	return {
		document: finalDocument || null,
		updateDocument: handleUpdate,
		isLoading,
		isUsingConvex: isConvexAvailable(),
	}
}
