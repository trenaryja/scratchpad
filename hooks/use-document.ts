'use client'

import { api } from '@/convex/_generated/api'
import { base64ToUint8Array, uint8ArrayToBase64 } from '@/convex/utils'
import { useMutation, useQuery } from 'convex/react'
import { nanoid } from 'nanoid'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as Y from 'yjs'
import { useDebouncedCallback } from './use-debounced-callback'
import { useLocalHistory } from './use-local-history'
import { useLocalStorage } from './use-local-storage'

export function useDocument(id?: string, username?: string) {
	const isLocal = !id
	const router = useRouter()

	// Local storage fallback for unsaved docs
	const [localTitle, setLocalTitle] = useLocalStorage('title', '')
	const [localContent, setLocalContent] = useLocalStorage('content', '')

	// Convex mutations/queries
	const docData = useQuery(api.documents.getDocument, id ? { id } : 'skip')
	const addUpdate = useMutation(api.documents.addDocUpdate)
	const deleteDocMutation = useMutation(api.documents.deleteDocument)
	const createDocMutation = useMutation(api.documents.createDocument)

	useEffect(() => {
		if (!isLocal && docData === null) createDocMutation({ id })
	}, [id, docData, createDocMutation, isLocal])

	const ydocRef = useRef<Y.Doc>(new Y.Doc())
	const ydoc = ydocRef.current

	// Apply snapshot + updates
	useEffect(() => {
		if (!docData) return
		if (docData.snapshotBase64) Y.applyUpdate(ydoc, base64ToUint8Array(docData.snapshotBase64))
		for (const u of docData.updates) Y.applyUpdate(ydoc, base64ToUint8Array(u.updateBase64))
	}, [docData, ydoc, isLocal])

	// Send local updates to Convex (remote only)
	useEffect(() => {
		if (isLocal) return
		const handler = (update: Uint8Array) => {
			addUpdate({
				id,
				updateBase64: uint8ArrayToBase64(update),
				user: username,
			})
		}
		ydoc.on('update', handler)
		return () => ydoc.off('update', handler)
	}, [ydoc, addUpdate, id, username, isLocal])

	// Y.Texts
	const yTitle = useMemo(() => ydoc.getText('title'), [ydoc])
	const yContent = useMemo(() => ydoc.getText('content'), [ydoc])

	// React state mirrors
	const [title, _setTitle] = useState(() => (isLocal ? localTitle : (yTitle?.toString() ?? '')))
	const [content, _setContent] = useState(() => (isLocal ? localContent : (yContent?.toString() ?? '')))

	// Sync title
	const setTitle = useCallback(
		(newVal: string) => {
			_setTitle(newVal)
			if (isLocal) setLocalTitle(newVal)
			else {
				yTitle!.delete(0, yTitle!.length)
				yTitle!.insert(0, newVal)
			}
		},
		[isLocal, setLocalTitle, yTitle],
	)
	useEffect(() => {
		if (!yTitle) return
		const observer = () => _setTitle(yTitle.toString())
		yTitle.observe(observer)
		return () => yTitle.unobserve(observer)
	}, [yTitle])
	useEffect(() => {
		if (isLocal) _setTitle(localTitle)
	}, [isLocal, localTitle])

	// Sync content
	const setContent = useCallback(
		(newVal: string) => {
			_setContent(newVal)
			if (isLocal) setLocalContent(newVal)
			else {
				yContent!.delete(0, yContent!.length)
				yContent!.insert(0, newVal)
			}
		},
		[isLocal, setLocalContent, yContent],
	)
	useEffect(() => {
		if (!yContent) return
		const observer = () => _setContent(yContent.toString())
		yContent.observe(observer)
		return () => yContent.unobserve(observer)
	}, [yContent])
	useEffect(() => {
		if (isLocal) _setContent(localContent)
	}, [isLocal, localContent])

	// Local history integration
	const { upsert, remove } = useLocalHistory()
	const debouncedUpsert = useDebouncedCallback(upsert, 500)
	useEffect(() => {
		debouncedUpsert(id || 'local', title || 'Untitled Document')
	}, [title, id, debouncedUpsert])

	const publish = async () => {
		if (!isLocal) return
		const newId = nanoid(8)
		upsert(newId, title)
		await createDocMutation({ id: newId, title, content })
		router.push(`/${newId}`)
	}

	const deleteDocument = async () => {
		if (isLocal) {
			remove('local')
			setLocalTitle('')
			setLocalContent('')
		} else {
			remove(id)
			await deleteDocMutation({ id })
			router.push('/')
		}
	}

	return {
		// High-level API
		isLocal,
		isLoading: !isLocal && docData === undefined,
		title,
		setTitle,
		content,
		setContent,
		publish,
		deleteDocument,

		// Low-level CRDT API
		ydoc,
		yTitle,
		yContent,
	}
}
