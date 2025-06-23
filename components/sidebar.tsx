'use client'

import { useDocumentCache } from '@/hooks/use-document-cache'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { LuEyeOff, LuFileText, LuSearch } from 'react-icons/lu'

export function Sidebar() {
	const [searchQuery, setSearchQuery] = useState('')
	const { documents, hideDocument } = useDocumentCache()
	const router = useRouter()

	const filteredDocuments = documents.filter((doc) => doc.title.toLowerCase().includes(searchQuery.toLowerCase()))

	return (
		<aside className='min-h-full bg-base-200 p-4 grid content-start gap-4'>
			<div className='input'>
				<LuSearch />
				<input
					type='text'
					placeholder='Search documents...'
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
			</div>

			<div className='grid gap-4 overflow-y-auto'>
				{filteredDocuments.length === 0 && <NoDocumentsFound />}
				{filteredDocuments.length > 0 &&
					filteredDocuments.map((doc) => (
						<div
							key={doc.id}
							className='card bg-base-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer'
							onClick={() => router.push(`/${doc.id}`)}
						>
							<div className='card-body p-3'>
								<div className='flex items-start justify-between'>
									<div className='flex-1 min-w-0'>
										<h3 className='font-medium truncate'>{doc.title}</h3>
										<p className='text-sm text-base-content/60'>{new Date(doc.lastModified).toLocaleDateString()}</p>
									</div>
									<button
										className='btn btn-ghost btn-xs'
										onClick={(e) => {
											e.stopPropagation()
											hideDocument(doc.id)
										}}
									>
										<LuEyeOff className='h-3 w-3' />
									</button>
								</div>
							</div>
						</div>
					))}
			</div>
		</aside>
	)
}

const NoDocumentsFound = () => (
	<div className='text-center text-base-content/60 py-8'>
		<LuFileText className='h-8 w-8 mx-auto mb-2 opacity-50' />
		<p>No documents found</p>
	</div>
)
