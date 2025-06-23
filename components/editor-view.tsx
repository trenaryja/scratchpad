'use client'

import { MarkdownPreview } from '@/components/markdown-preview'
import { PublishButton } from '@/components/publish-button'
import { Editor } from '@monaco-editor/react'
import { useTheme } from 'next-themes'
import { useEffect, useRef, useState } from 'react'

interface EditorViewProps {
	title: string
	content: string
	onTitleChange: (title: string) => void
	onContentChange: (content: string) => void
	isLocal: boolean
	documentId?: string
}

export function EditorView({ title, content, onTitleChange, onContentChange, isLocal }: EditorViewProps) {
	const [editorContent, setEditorContent] = useState(content)
	const [editorTitle, setEditorTitle] = useState(title)
	const { theme } = useTheme()
	const contentRef = useRef(content)
	const titleRef = useRef(title)
	const isInitialized = useRef(false)

	// Initialize state only once
	useEffect(() => {
		if (!isInitialized.current) {
			setEditorContent(content)
			setEditorTitle(title)
			contentRef.current = content
			titleRef.current = title
			isInitialized.current = true
		}
	}, [content, title])

	// Update local state when props change (for published docs with real-time updates)
	useEffect(() => {
		if (isInitialized.current && content !== contentRef.current) {
			contentRef.current = content
			setEditorContent(content)
		}
	}, [content])

	useEffect(() => {
		if (isInitialized.current && title !== titleRef.current) {
			titleRef.current = title
			setEditorTitle(title)
		}
	}, [title])

	const handleEditorChange = (value: string | undefined) => {
		const newContent = value || ''
		setEditorContent(newContent)
		contentRef.current = newContent
		onContentChange(newContent)
	}

	const handleTitleChange = (newTitle: string) => {
		setEditorTitle(newTitle)
		titleRef.current = newTitle
		onTitleChange(newTitle)
	}

	const monacoTheme = theme === 'dark' ? 'vs-dark' : 'light'

	return (
		<div className='h-full flex flex-col'>
			<div className='flex items-center gap-4 p-4 border-b border-base-300'>
				<input
					type='text'
					value={editorTitle}
					onChange={(e) => handleTitleChange(e.target.value)}
					className='input input-ghost text-xl font-bold flex-1 focus:input-bordered'
					placeholder='Document title...'
				/>
				{isLocal && <PublishButton content={editorContent} title={editorTitle} />}
				<div className='text-sm text-base-content/60'>
					{editorContent.length} / 10,000 chars
					{editorContent.length > 10000 && <span className='text-error ml-2'>Limit exceeded!</span>}
				</div>
			</div>

			<div className='flex-1 flex'>
				<div className='flex-1 border-r border-base-300'>
					<Editor
						height='100%'
						defaultLanguage='markdown'
						value={editorContent}
						onChange={handleEditorChange}
						theme={monacoTheme}
						options={{
							minimap: { enabled: false },
							wordWrap: 'on',
							lineNumbers: 'on',
							fontSize: 14,
							fontFamily:
								'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace',
							scrollBeyondLastLine: false,
							automaticLayout: true,
							tabSize: 2,
							insertSpaces: false,
							quickSuggestions: false,
							suggestOnTriggerCharacters: false,
							acceptSuggestionOnEnter: 'off',
							tabCompletion: 'off',
							wordBasedSuggestions: 'off',
							parameterHints: { enabled: false },
							hover: { enabled: false },
						}}
					/>
				</div>
				<div className='flex-1'>
					<MarkdownPreview content={editorContent} />
				</div>
			</div>
		</div>
	)
}
