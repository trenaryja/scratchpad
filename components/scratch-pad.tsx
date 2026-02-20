'use client'

import { SOFT_LIMIT, TITLE_LIMIT } from '@/convex/utils'
import { useDocument } from '@/hooks/use-document'
import { useDocumentTitle, useLocalStorage } from '@mantine/hooks'
import { Editor } from '@monaco-editor/react'
import { cn, daisyThemeMap, isDaisyThemeName, toast, useTheme } from '@trenaryja/ui'
import Link from 'next/link'
import { LuClipboard, LuCloudUpload, LuHouse, LuMenu, LuSticker, LuTrash2 } from 'react-icons/lu'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ConfirmButton } from './confirm-button'
import { HoldableButton } from './holdable-button'
import { toggleSidebar } from './sidebar'
import { SwapCycle } from './swap-cycle'
import type { SingleViewOption, ViewOption } from './view-dialog'
import { ViewDialog } from './view-dialog'

export type ScratchPadProps = {
	id?: string
	readonly?: boolean
}

const SWAP_DURATION = [5000, 750] as const
const SWAP_ITEMS = [<LuHouse key='house' />, <LuSticker key='sticker' />]

const getPublishTitle = (p: { title: string; content: string; softLimit: number; titleLimit: number }) => {
	if (!p.title.trim()) return 'Add a title to publish'
	if (!p.content.trim()) return 'Add content to publish'
	if (p.title.length > p.titleLimit) return `Title exceeds ${p.titleLimit.toLocaleString()} character limit`
	if (p.content.length > p.softLimit) return `Content exceeds ${p.softLimit.toLocaleString()} character limit`
	return 'Publish'
}

const isTitleInvalid = (title: string) => !title.trim() || title.length > TITLE_LIMIT

const getEditorTheme = (theme: string | undefined) =>
	isDaisyThemeName(theme) && daisyThemeMap[theme].colorScheme === 'light' ? 'light' : 'vs-dark'

const CLIPBOARD_ICON = (
	<div className='p-2 rounded-full aspect-square bg-base-content text-base-100'>
		<LuClipboard />
	</div>
)

const copyToClipboard = (id: string | undefined, wasHeld: boolean) => {
	const url = wasHeld ? `${window.location.origin}/r/${id}` : window.location.href
	navigator.clipboard.writeText(url)
	toast.info(`Copied ${url}`, { icon: CLIPBOARD_ICON })
}

export const ScratchPad = ({ id, readonly = false }: ScratchPadProps) => {
	const { resolvedTheme } = useTheme()
	const [view, setView] = useLocalStorage<ViewOption>({
		key: 'view',
		defaultValue: readonly ? 'readonly' : 'code|readonly',
	})
	const { isLoading, title, setTitle, content, setContent, publish, deleteDocument } = useDocument(id)
	useDocumentTitle(title || 'Markdown Scratchpad')

	const editorTheme = getEditorTheme(resolvedTheme)

	const activeViews = view.split('|') as SingleViewOption[]
	const isSplit = activeViews.length > 1
	const showCode = activeViews.includes('code')
	const showReadonly = activeViews.includes('readonly')
	const orderStyle = (v: SingleViewOption) => (isSplit ? { order: activeViews.indexOf(v) } : undefined)

	const publishTitle = getPublishTitle({ title, content, softLimit: SOFT_LIMIT, titleLimit: TITLE_LIMIT })

	return (
		<>
			<header className='flex flex-wrap justify-center items-center p-2 bg-base-200 gap-2'>
				{readonly ? (
					<h2 className='text-lg'>{title}</h2>
				) : (
					<>
						<div className='flex items-center gap-2 grow'>
							<button
								type='button'
								aria-label='Open sidebar'
								className='btn btn-ghost btn-square'
								onClick={toggleSidebar}
							>
								<LuMenu />
							</button>
							<Link href='/'>
								<SwapCycle duration={SWAP_DURATION} className='swap-flip btn btn-ghost btn-square' items={SWAP_ITEMS} />
							</Link>
							<input
								value={title}
								readOnly={readonly}
								placeholder='Add a title...'
								onChange={(e) => setTitle(e.target.value)}
								className={cn(
									'input grow min-w-xs text-lg font-bold',
									isTitleInvalid(title) ? 'input-error' : 'input-ghost',
								)}
							/>
						</div>
						{!id && (
							<ConfirmButton
								title={publishTitle}
								className='btn btn-square hover:btn-primary'
								confirmClassName='btn hover:btn-primary'
								confirmChildren={
									<>
										<LuCloudUpload />
										<span>Publish?</span>
									</>
								}
								onConfirm={publish}
								disabled={publishTitle !== 'Publish'}
							>
								<LuCloudUpload />
							</ConfirmButton>
						)}
						{id && (
							<>
								<ConfirmButton
									className='btn btn-square hover:btn-error'
									confirmClassName='btn hover:btn-error'
									confirmChildren={
										<>
											<LuTrash2 />
											<span>Delete?</span>
										</>
									}
									onConfirm={deleteDocument}
								>
									<LuTrash2 />
								</ConfirmButton>
								<HoldableButton
									className='btn btn-square hover:btn-primary'
									onHold={() => copyToClipboard(id, true)}
									onClick={() => copyToClipboard(id, false)}
								>
									<LuClipboard />
								</HoldableButton>
							</>
						)}
						<ViewDialog view={view} setView={setView} />
					</>
				)}
			</header>

			<main
				className={cn('grid relative overflow-auto', {
					'grid-rows-2 grid-cols-1 lg:grid-cols-2 lg:grid-rows-1': isSplit,
				})}
			>
				{isLoading ? (
					<div className='grid place-items-center'>
						<span className='loading loading-spinner loading-lg' />
					</div>
				) : (
					<>
						{showCode && (
							<div style={orderStyle('code')}>
								<Editor
									value={content}
									onChange={(val) => setContent(val ?? '')}
									defaultLanguage='markdown'
									theme={editorTheme}
									options={{ minimap: { enabled: false } }}
								/>
							</div>
						)}
						{showReadonly && (
							<div
								tabIndex={-1}
								className='prose prose-sm max-w-none p-4 relative size-full overflow-auto'
								style={orderStyle('readonly')}
							>
								<ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
							</div>
						)}

						{!readonly && (
							<div
								className={cn(
									'absolute text-xs right-2 top-2 h-fit lg:top-auto lg:bottom-2 backdrop-blur p-2 rounded-field',
									content.length > SOFT_LIMIT
										? 'text-error'
										: content.length > SOFT_LIMIT * 0.9
											? 'text-warning'
											: 'text-current/50',
								)}
							>
								{content.length.toLocaleString()} / {SOFT_LIMIT.toLocaleString()}
							</div>
						)}
					</>
				)}
			</main>
		</>
	)
}
