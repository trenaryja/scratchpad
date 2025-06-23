'use client'

import { useState, useEffect } from 'react'
import { Search, FileText } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useDocumentCache } from '@/hooks/use-document-cache'

interface CommandPaletteProps {
	open: boolean
	onClose: () => void
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
	const [query, setQuery] = useState('')
	const { documents } = useDocumentCache()
	const router = useRouter()

	const filteredDocuments = documents.filter((doc) => doc.title.toLowerCase().includes(query.toLowerCase()))

	useEffect(() => {
		if (open) {
			setQuery('')
		}
	}, [open])

	const handleSelect = (id: string) => {
		router.push(`/${id}`)
		onClose()
	}

	if (!open) return null

	return (
		<div className='fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-20'>
			<div className='bg-base-100 rounded-lg shadow-xl w-full max-w-lg mx-4'>
				<div className='p-4 border-b border-base-300'>
					<div className='input-group'>
						<span className='bg-base-200'>
							<Search className='h-4 w-4' />
						</span>
						<input
							type='text'
							placeholder='Search documents...'
							className='input input-bordered flex-1'
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							autoFocus
						/>
					</div>
				</div>

				<div className='max-h-80 overflow-y-auto'>
					{filteredDocuments.length === 0 ? (
						<div className='p-8 text-center text-base-content/60'>
							<FileText className='h-8 w-8 mx-auto mb-2 opacity-50' />
							<p>No documents found</p>
						</div>
					) : (
						filteredDocuments.map((doc) => (
							<button
								key={doc.id}
								className='w-full p-3 text-left hover:bg-base-200 flex items-center gap-3'
								onClick={() => handleSelect(doc.id)}
							>
								<FileText className='h-4 w-4 text-base-content/60' />
								<div>
									<div className='font-medium'>{doc.title}</div>
									<div className='text-sm text-base-content/60'>{new Date(doc.lastModified).toLocaleDateString()}</div>
								</div>
							</button>
						))
					)}
				</div>
			</div>

			<div className='fixed inset-0 -z-10' onClick={onClose} />
		</div>
	)
}
