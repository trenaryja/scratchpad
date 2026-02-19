'use client'

import { EditorContent, EditorOptions, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { ComponentProps } from 'react'

export type TiptapProps = {
	options?: EditorOptions
} & Omit<ComponentProps<typeof EditorContent>, 'editor'>

export const Tiptap = ({ options, ...props }: TiptapProps) => {
	const editor = useEditor({
		extensions: [StarterKit],
		immediatelyRender: false,
		editorProps: {
			attributes: {
				class: 'size-full p-2 outline-none prose-sm max-w-none text-pretty',
			},
		},
	})

	return <EditorContent {...props} editor={editor} />
}
