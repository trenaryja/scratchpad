'use client'

import { useConvexDocument } from '@/hooks/use-convex-document'
import { useLocalHistory } from '@/hooks/use-local-history'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { useTabTitle } from '@/hooks/use-tab-title'
import { cn, themes } from '@/utils'
import { Editor } from '@monaco-editor/react'
import { nanoid } from 'nanoid'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
	LuClipboard,
	LuCloudUpload,
	LuCode,
	LuHouse,
	LuLetterText,
	LuMenu,
	LuSquareSplitHorizontal,
	LuSticker,
	LuTrash2,
	LuWifiOff,
} from 'react-icons/lu'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { toast } from 'sonner'
import { ConfirmButton } from './confirm-button'
import { HoldableButton } from './holdable-button'
import { SwapCycle } from './swap-cycle'

export type ScratchPadProps = {
	id?: string
	readonly?: boolean
}

export function ScratchPad({ id = '', readonly = false }: ScratchPadProps) {
	const { resolvedTheme } = useTheme()
	const router = useRouter()
	const [view, setView] = useState<'view' | 'edit' | 'split'>(readonly ? 'view' : 'split')

	const { upsert: upsertLocalHistory } = useLocalHistory()
	const [localTitle, setLocalTitle] = useLocalStorage('title', '')
	const [localContent, setLocalContent] = useLocalStorage('content', '')

	const { document, updateDocument, createDocument, deleteDocument } = useConvexDocument(id)

	const title = (id ? document?.title : localTitle) ?? ''
	const content = (id ? document?.content : localContent) ?? ''

	useTabTitle(title)

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

	const handleCopyToClipboard = (wasHeld: boolean) => {
		const url = wasHeld ? `${window.location.origin}/r/${id}` : window.location.href
		navigator.clipboard.writeText(url)
		toast.info(`Copied ${url}`, {
			icon: (
				<div className='p-2 rounded-full aspect-square bg-base-content text-base-100'>
					<LuClipboard />
				</div>
			),
		})
	}

	return (
		<>
			<header className='flex flex-wrap justify-center items-center p-2 bg-base-200 gap-2'>
				{readonly ? (
					<h2 className='text-lg'>{title}</h2>
				) : (
					<>
						<div className='flex items-center gap-2 grow'>
							<label tabIndex={0} htmlFor='sidebar' className='btn btn-ghost btn-square'>
								<LuMenu />
							</label>
							<Link href='/'>
								<SwapCycle duration={[5000, 750]} className='swap-flip btn btn-ghost btn-square'>
									<LuHouse />
									<LuSticker />
									<LuHouse />
									<LuWifiOff />
								</SwapCycle>
							</Link>
							<input
								value={title}
								readOnly={view === 'view'}
								onChange={(e) => handleTitleChange(e.target.value)}
								className='input input-ghost grow min-w-xs text-lg font-bold '
								placeholder='Document title...'
							/>
						</div>
						{!id && (
							<ConfirmButton
								title='Publish'
								className='btn btn-square hover:btn-primary'
								confirmChildren={
									<>
										<LuCloudUpload />
										<span>Publish?</span>
									</>
								}
								onConfirm={handlePublish}
								disabled={!content.trim() || !title.trim()}
							>
								<LuCloudUpload />
							</ConfirmButton>
						)}
						{id && (
							<ConfirmButton
								className='btn btn-square hover:btn-error'
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
						{id && (
							<HoldableButton
								className='btn btn-square hover:btn-primary'
								onHold={() => handleCopyToClipboard(true)}
								onClick={() => handleCopyToClipboard(false)}
							>
								<LuClipboard />
							</HoldableButton>
						)}
						<div className='flex join'>
							<button
								title='Edit'
								className={cn('join-item btn btn-square hover:btn-primary', { 'btn-primary': view === 'edit' })}
								onClick={() => setView('edit')}
							>
								<LuCode />
							</button>
							<button
								title='Split'
								className={cn('join-item btn btn-square hover:btn-primary', { 'btn-primary': view === 'split' })}
								onClick={() => setView('split')}
							>
								<LuSquareSplitHorizontal />
							</button>
							<button
								title='View'
								className={cn('join-item btn btn-square hover:btn-primary', { 'btn-primary': view === 'view' })}
								onClick={() => setView('view')}
							>
								<LuLetterText />
							</button>
						</div>
					</>
				)}
			</header>

			<main
				className={cn('grid relative overflow-auto', {
					'grid-rows-2 grid-cols-1 lg:grid-cols-2 lg:grid-rows-1': view === 'split',
				})}
			>
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
					<div tabIndex={-1} className='prose prose-sm max-w-none p-4 relative size-full overflow-auto'>
						<ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
					</div>
				)}
				{view !== 'view' && (
					<div className='absolute text-xs right-2 top-2 h-fit lg:top-auto lg:bottom-2 backdrop-blur p-2 rounded-field text-current/50'>
						{content.length ?? 0} / 10,000
					</div>
				)}
			</main>
		</>
	)
}

// TODO: debounce convex updates with good local dx
// TODO: infisical management
// TODO: highlightjs or robsehype then maybe shiki then maybe custom/daisy?
// TODO: update tabTitle for local document on load
