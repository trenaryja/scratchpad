'use client'

import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

const Tiptap = () => {
	const editor = useEditor({
		extensions: [StarterKit],
		immediatelyRender: false,
		editorProps: {
			attributes: {
				class: 'size-full p-2 outline-none prose-sm max-w-none text-pretty',
			},
		},
	})

	return <EditorContent editor={editor} />
}

export default Tiptap
