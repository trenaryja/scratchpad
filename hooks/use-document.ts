'use client'

import { api } from '@/convex/_generated/api'
import { base64ToUint8Array, uint8ArrayToBase64 } from '@/convex/utils'
import { useDebouncedCallback, useLocalStorage } from '@mantine/hooks'
import { toast } from '@trenaryja/ui'
import { useMutation, useQuery } from 'convex/react'
import { nanoid } from 'nanoid'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as Y from 'yjs'
import { useLocalHistory } from './use-local-history'

const REMOTE_ORIGIN = 'remote'
const SYNC_DEBOUNCE_MS = 500

type YjsSyncOptions = {
	id: string | undefined
	isLocal: boolean
	docData: { snapshotBase64?: string } | null | undefined
	updateSnapshotMutation: ReturnType<typeof useMutation<typeof api.documents.updateSnapshot>>
}

const useYjsSync = ({ id, isLocal, docData, updateSnapshotMutation }: YjsSyncOptions) => {
	const ydoc = useMemo(() => new Y.Doc(), [])
	useEffect(() => () => ydoc.destroy(), [ydoc])

	useEffect(() => {
		if (!docData?.snapshotBase64) return
		Y.applyUpdate(ydoc, base64ToUint8Array(docData.snapshotBase64), REMOTE_ORIGIN)
	}, [docData, ydoc])

	const pendingRef = useRef(false)
	const syncErrorRef = useRef(false)
	const flushToServer = useDebouncedCallback(() => {
		if (!pendingRef.current || isLocal || !id) return
		pendingRef.current = false
		const update = Y.encodeStateAsUpdate(ydoc)
		updateSnapshotMutation({ id, updateBase64: uint8ArrayToBase64(update) }).catch(() => {
			if (syncErrorRef.current) return
			syncErrorRef.current = true
			toast.error('Failed to sync changes to server')
		})
	}, SYNC_DEBOUNCE_MS)

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

	const yTitle = useMemo(() => ydoc.getText('title'), [ydoc])
	const yContent = useMemo(() => ydoc.getText('content'), [ydoc])

	const [remoteTitle, setRemoteTitle] = useState(() => yTitle?.toString() ?? '')
	const [remoteContent, setRemoteContent] = useState(() => yContent?.toString() ?? '')

	useEffect(() => {
		if (!yTitle) return
		const observer = () => setRemoteTitle(yTitle.toString())
		yTitle.observe(observer)
		return () => yTitle.unobserve(observer)
	}, [yTitle])

	useEffect(() => {
		if (!yContent) return
		const observer = () => setRemoteContent(yContent.toString())
		yContent.observe(observer)
		return () => yContent.unobserve(observer)
	}, [yContent])

	return { ydoc, yTitle, yContent, remoteTitle, setRemoteTitle, remoteContent, setRemoteContent }
}

export const useDocument = (id?: string) => {
	const isLocal = !id
	const router = useRouter()

	const [localTitle, setLocalTitle] = useLocalStorage({ key: 'title', defaultValue: '' })
	const [localContent, setLocalContent] = useLocalStorage({ key: 'content', defaultValue: '' })

	const docData = useQuery(api.documents.getDocument, id ? { id } : 'skip')
	const updateSnapshotMutation = useMutation(api.documents.updateSnapshot)
	const deleteDocMutation = useMutation(api.documents.deleteDocument)
	const createDocMutation = useMutation(api.documents.createDocument)

	useEffect(() => {
		if (!isLocal && docData === null) createDocMutation({ id }).catch(() => toast.error('Failed to create document'))
	}, [id, docData, createDocMutation, isLocal])

	const { ydoc, yTitle, yContent, remoteTitle, setRemoteTitle, remoteContent, setRemoteContent } = useYjsSync({
		id,
		isLocal,
		docData,
		updateSnapshotMutation,
	})

	const title = isLocal ? localTitle : remoteTitle
	const content = isLocal ? localContent : remoteContent

	const setTitle = useCallback(
		(newVal: string) => {
			if (isLocal) return setLocalTitle(newVal)
			setRemoteTitle(newVal)
			ydoc.transact(() => {
				yTitle.delete(0, yTitle.length)
				yTitle.insert(0, newVal)
			})
		},
		[isLocal, setLocalTitle, yTitle, ydoc, setRemoteTitle],
	)

	const setContent = useCallback(
		(newVal: string) => {
			if (isLocal) return setLocalContent(newVal)
			setRemoteContent(newVal)
			ydoc.transact(() => {
				yContent.delete(0, yContent.length)
				yContent.insert(0, newVal)
			})
		},
		[isLocal, setLocalContent, yContent, ydoc, setRemoteContent],
	)

	const { upsert, remove } = useLocalHistory()
	const debouncedUpsert = useDebouncedCallback(upsert, 500)
	useEffect(() => {
		debouncedUpsert(id ?? '', title ?? 'Untitled Document')
	}, [title, id, debouncedUpsert])

	const publish = async () => {
		if (!isLocal) return

		const newId = nanoid(8)

		try {
			await createDocMutation({ id: newId, title, content })
			upsert(newId, title)
			router.push(`/${newId}`)
		} catch {
			toast.error('Failed to publish document')
		}
	}

	const deleteDocument = async () => {
		if (isLocal) {
			remove('')
			setLocalTitle('')
			setLocalContent('')
		} else if (id) {
			try {
				await deleteDocMutation({ id })
				remove(id)
				router.push('/')
			} catch {
				toast.error('Failed to delete document')
			}
		}
	}

	return {
		isLoading: !isLocal && docData === undefined,
		title,
		setTitle,
		content,
		setContent,
		publish,
		deleteDocument,
	}
}
