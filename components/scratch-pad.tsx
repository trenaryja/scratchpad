'use client'

import { useConvexDocument } from '@/hooks/use-convex-document'
import { useLocalHistory } from '@/hooks/use-local-history'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { useTabTitle } from '@/hooks/use-tab-title'
import { cn, makeUniquePairs, showModal, themes } from '@/utils'
import { Editor } from '@monaco-editor/react'
import { nanoid } from 'nanoid'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
	LuClipboard,
	LuCloudUpload,
	LuCode,
	LuColumns2,
	LuHouse,
	LuLetterText,
	LuMenu,
	LuNotebookPen,
	LuSticker,
	LuTrash2,
	LuX,
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

const VIEW_DIALOG_ID = 'view-modal'
const viewOptions = ['code', 'tiptap', 'readonly'] as const
const multiViewOptions = makeUniquePairs(viewOptions)
type SingleViewOption = (typeof viewOptions)[number]
type MultiViewOption = (typeof multiViewOptions)[number]
type ViewOption = SingleViewOption | MultiViewOption

export function ScratchPad({ id = '', readonly = false }: ScratchPadProps) {
	const { resolvedTheme } = useTheme()
	const router = useRouter()
	const [view, setView] = useLocalStorage<ViewOption>('view', readonly ? 'readonly' : 'code|readonly')
	const [localTitle, setLocalTitle] = useLocalStorage('title', '')
	const [localContent, setLocalContent] = useLocalStorage('content', '')
	const { upsert: upsertLocalHistory } = useLocalHistory()
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

	const CodeView = (
		<Editor
			key='code'
			value={content}
			onChange={handleContentChange}
			defaultLanguage='markdown'
			theme={themes.find((x) => x.name === resolvedTheme)?.mode === 'light' ? 'light' : 'vs-dark'}
			options={{ minimap: { enabled: false } }}
		/>
	)

	const TipTapView = (
		<Editor
			key='tiptap'
			value={content}
			onChange={handleContentChange}
			defaultLanguage='markdown'
			theme={themes.find((x) => x.name === resolvedTheme)?.mode === 'light' ? 'light' : 'vs-dark'}
			options={{ minimap: { enabled: false } }}
		/>
	)

	const ReadonlyView = (
		<div key='readonly' tabIndex={-1} className='prose prose-sm max-w-none p-4 relative size-full overflow-auto'>
			<ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
		</div>
	)

	const viewDict: Record<SingleViewOption, { render: React.ReactNode; icon: React.ReactNode }> = {
		code: { icon: <LuCode />, render: CodeView },
		readonly: { icon: <LuLetterText />, render: ReadonlyView },
		tiptap: { icon: <LuNotebookPen />, render: TipTapView },
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
								</SwapCycle>
							</Link>
							<input
								value={title}
								readOnly={readonly}
								onChange={(e) => handleTitleChange(e.target.value)}
								className='input input-ghost grow min-w-xs text-lg font-bold '
								placeholder='Document title...'
							/>
						</div>
						{!id && (
							<ConfirmButton
								title='Publish'
								className='btn btn-square hover:btn-primary'
								confirmClassName='btn hover:btn-primary'
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
								confirmClassName='btn hover:btn-error'
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
						<button
							title='Change view'
							onClick={() => showModal(VIEW_DIALOG_ID)}
							className={cn('btn btn-square hover:btn-primary')}
						>
							<LuColumns2 />
						</button>
					</>
				)}
			</header>

			<main
				className={cn('grid relative overflow-auto', {
					'grid-rows-2 grid-cols-1 lg:grid-cols-2 lg:grid-rows-1': view.includes('|'),
				})}
			>
				{view.split('|').map((x) => viewDict[x as SingleViewOption].render)}

				{!readonly && (
					<div className='absolute text-xs right-2 top-2 h-fit lg:top-auto lg:bottom-2 backdrop-blur p-2 rounded-field text-current/50'>
						{content.length ?? 0} / 10,000
					</div>
				)}

				<dialog id={VIEW_DIALOG_ID} className='modal'>
					<div className='modal-box [&_svg]:shrink-0 grid gap-y-4 place-items-center'>
						<form method='dialog' className='absolute right-1 top-1'>
							<button className='btn btn-ghost btn-square'>
								<LuX />
							</button>
						</form>
						<div className='grid gap-4'>
							<h2 className='text-lg text-center'>Single View</h2>
							<div className='flex gap-2 justify-between'>
								{viewOptions.map((viewOption) => (
									<button
										key={viewOption}
										title={viewOption}
										className={cn('btn btn-xl btn-square', { 'btn-primary': view === viewOption })}
										onClick={() => setView(viewOption)}
									>
										{viewDict[viewOption].icon}
									</button>
								))}
							</div>
							<div className='divider'>OR</div>
							<h2 className='text-lg text-center'>Split View</h2>
							<div className='grid gap-2 grid-cols-2'>
								{multiViewOptions.map((viewOption) => {
									const [leftView, rightView] = viewOption.split('|') as [SingleViewOption, SingleViewOption]
									return (
										<button
											key={viewOption}
											title={viewOption}
											className={cn('btn btn-xl flex items-center px-0 w-[calc(var(--size)*2))]', {
												'btn-primary': view === viewOption,
											})}
											onClick={() => setView(viewOption)}
										>
											{viewDict[leftView].icon}
											<div className='divider divider-horizontal m-1' />
											{viewDict[rightView].icon}
										</button>
									)
								})}
							</div>
						</div>
					</div>
				</dialog>
			</main>
		</>
	)
}

// TODO: debounce convex updates with good local dx
// TODO: infisical management
// TODO: highlightjs or robsehype then maybe shiki then maybe custom/daisy?
// TODO: update tabTitle for local document on load
