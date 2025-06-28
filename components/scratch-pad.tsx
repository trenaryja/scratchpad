'use client'

import { useConvexDocument } from '@/hooks/use-convex-document'
import { useLocalHistory } from '@/hooks/use-local-history'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { cn, themes } from '@/utils'
import { Editor } from '@monaco-editor/react'
import { nanoid } from 'nanoid'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { LuCode, LuLetterText, LuMenu, LuShare, LuSquareSplitHorizontal, LuTrash2 } from 'react-icons/lu'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ConfirmButton } from './confirm-button'

export function ScratchPad({ id = '' }: { id?: string }) {
	const { resolvedTheme } = useTheme()
	const router = useRouter()
	const [view, setView] = useState<'view' | 'edit' | 'split'>('split')

	const { upsert: upsertLocalHistory } = useLocalHistory()
	const [localTitle, setLocalTitle] = useLocalStorage('title', '')
	const [localContent, setLocalContent] = useLocalStorage('content', '')

	const { document, updateDocument, createDocument, deleteDocument } = useConvexDocument(id)

	const title = (id ? document?.title : localTitle) ?? ''
	const content = (id ? document?.content : localContent) ?? ''

	const handleTitleChange = (newTitle = '') => {
		if (!id) {
			setLocalTitle(newTitle)
			upsertLocalHistory(id, newTitle)
			return
		}
		updateDocument({ title: newTitle })
	}

	const handleContentChange = (newContent = '') => {
		if (!id) {
			setLocalContent(newContent)
			return
		}
		updateDocument({ content: newContent })
	}

	const handleDelete = () => {
		deleteDocument()
		router.push('/')
	}

	const handlePublish = async () => {
		const newId = nanoid(8)
		upsertLocalHistory(newId, title)
		await createDocument({
			nanoid: newId,
			title: title,
			content: content,
		})
		router.push(`/${newId}`)
	}
	return (
		<div className='min-h-screen max-h-screen h-screen grid-rows-[auto_1fr] overflow-hidden'>
			<div className='flex items-center p-2 bg-base-200 gap-2'>
				<label tabIndex={0} htmlFor='sidebar' className='btn btn-ghost btn-square'>
					<LuMenu />
				</label>
				<input
					value={title}
					readOnly={view === 'view'}
					onChange={(e) => handleTitleChange(e.target.value)}
					className='input input-ghost text-lg font-bold flex-1'
					placeholder='Document title...'
				/>
				{!id && (
					<ConfirmButton
						className='btn hover:btn-primary'
						confirmChildren={
							<>
								<LuShare />
								<span>Publish?</span>
							</>
						}
						onConfirm={handlePublish}
						disabled={!content.trim() || !title.trim()}
					>
						<LuShare />
					</ConfirmButton>
				)}
				{id && (
					<ConfirmButton
						className='btn hover:btn-error'
						confirmChildren={
							<>
								<LuTrash2 />
								<span>Delete?</span>
							</>
						}
						onConfirm={handleDelete}
					>
						<LuTrash2 />
					</ConfirmButton>
				)}
				<div className='flex join'>
					<button
						title='Edit'
						className={cn('join-item btn', { 'btn-primary': view === 'edit' })}
						onClick={() => setView('edit')}
					>
						<LuCode />
					</button>
					<button
						title='Split'
						className={cn('join-item btn', { 'btn-primary': view === 'split' })}
						onClick={() => setView('split')}
					>
						<LuSquareSplitHorizontal />
					</button>
					<button
						title='View'
						className={cn('join-item btn', { 'btn-primary': view === 'view' })}
						onClick={() => setView('view')}
					>
						<LuLetterText />
					</button>
				</div>
			</div>
			<div className={cn('grid relative size-full', { 'grid-cols-2': view === 'split' })}>
				{view !== 'view' && (
					<Editor
						value={content}
						onChange={handleContentChange}
						defaultLanguage='markdown'
						theme={themes.find((x) => x.name === resolvedTheme)?.mode === 'light' ? 'light' : 'vs-dark'}
						options={{ minimap: { enabled: false } }}
					/>
				)}
				{view !== 'edit' && (
					<div tabIndex={-1} className='prose prose-sm max-w-none p-4 relative overflow-auto'>
						<ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
					</div>
				)}
				<div className='fixed right-1 bottom-1 opacity-50'>{content.length ?? 0} / 10,000</div>
			</div>
		</div>
	)
}

// TODO: custom domain/hosting
// TODO: live tab title?
// TODO: add footer/info/help
// TODO: update localHistory on page/document load
// TODO: infisical management
// TODO: read-only mode
// TODO: debounce convex updates with good local dx
// TODO: highlightjs or rehype then maybe shiki then maybe custom/daisy?
