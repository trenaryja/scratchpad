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

const REMOTE_ORIGIN = 'remote'
const SYNC_DEBOUNCE_MS = 500

export const useDocument = (id?: string) => {
	const isLocal = !id
	const router = useRouter()

	// Local storage fallback for unsaved docs
	const [localTitle, setLocalTitle] = useLocalStorage('title', '')
	const [localContent, setLocalContent] = useLocalStorage('content', '')

	// Convex mutations/queries
	const docData = useQuery(api.documents.getDocument, id ? { id } : 'skip')
	const updateSnapshotMutation = useMutation(api.documents.updateSnapshot)
	const deleteDocMutation = useMutation(api.documents.deleteDocument)
	const createDocMutation = useMutation(api.documents.createDocument)

	useEffect(() => {
		if (!isLocal && docData === null) createDocMutation({ id })
	}, [id, docData, createDocMutation, isLocal])

	const ydocRef = useRef<Y.Doc>(new Y.Doc())
	const ydoc = ydocRef.current

	// Apply remote snapshot — tagged so local handler skips it
	useEffect(() => {
		if (!docData?.snapshotBase64) return
		Y.applyUpdate(ydoc, base64ToUint8Array(docData.snapshotBase64), REMOTE_ORIGIN)
	}, [docData, ydoc])

	// Debounced sync: flush full Yjs state to server
	const pendingRef = useRef(false)
	const flushToServer = useDebouncedCallback(() => {
		if (!pendingRef.current || isLocal || !id) return
		pendingRef.current = false
		const update = Y.encodeStateAsUpdate(ydoc)
		updateSnapshotMutation({ id, updateBase64: uint8ArrayToBase64(update) })
	}, SYNC_DEBOUNCE_MS)

	// Listen for local-only updates, mark dirty + schedule flush
	useEffect(() => {
		if (isLocal) return
		const handler = (_update: Uint8Array, origin: unknown) => {
			if (origin === REMOTE_ORIGIN) return
			pendingRef.current = true
			flushToServer()
		}
		ydoc.on('update', handler)
		return () => ydoc.off('update', handler)
	}, [ydoc, isLocal, flushToServer])

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
				ydoc.transact(() => {
					yTitle.delete(0, yTitle.length)
					yTitle.insert(0, newVal)
				})
			}
		},
		[isLocal, setLocalTitle, yTitle, ydoc],
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
				ydoc.transact(() => {
					yContent.delete(0, yContent.length)
					yContent.insert(0, newVal)
				})
			}
		},
		[isLocal, setLocalContent, yContent, ydoc],
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
		isLocal,
		isLoading: !isLocal && docData === undefined,
		title,
		setTitle,
		content,
		setContent,
		publish,
		deleteDocument,
		ydoc,
		yTitle,
		yContent,
	}
}
