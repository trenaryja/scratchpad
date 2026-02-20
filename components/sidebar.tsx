'use client'

import { useLocalHistory } from '@/hooks/use-local-history'
import { cn, ThemePicker } from '@trenaryja/ui'
import { format } from 'date-fns'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { LuEyeOff, LuFileText, LuSearch, LuWifiOff } from 'react-icons/lu'
import * as R from 'remeda'

export const toggleSidebar = () => {
	const el = document.getElementById('sidebar') as HTMLInputElement | null
	if (el) el.checked = !el.checked
}

export const Sidebar = () => {
	const [searchQuery, setSearchQuery] = useState('')
	const { history, remove } = useLocalHistory()
	const params = useParams()
	const id = typeof params.id === 'string' ? params.id : ''

	const filteredHistory = R.pipe(
		history,
		R.entries(),
		R.map(([entryId, entry]) => ({ id: entryId, ...entry })),
		R.filter(({ title }) => title.toLowerCase().includes(searchQuery.toLowerCase())),
		R.sortBy([(x) => x.id === '', 'desc'], [(x) => x.id === id, 'desc'], [(x) => x.lastOpened, 'desc']),
	)

	return (
		<div className='drawer absolute z-50'>
			<input id='sidebar' type='checkbox' className='drawer-toggle' />
			<div className='drawer-side'>
				<label htmlFor='sidebar' aria-label='Close sidebar' className='drawer-overlay' />

				<aside className='min-h-full bg-base-100 p-4 grid gap-4 content-start max-w-xs'>
					<div className='flex gap-2'>
						<div className='input'>
							<LuSearch />
							<input placeholder='Search...' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
						</div>
						<ThemePicker variant='popover' />
					</div>

					<div className='grid gap-4 overflow-y-auto'>
						{filteredHistory.length === 0 && (
							<div className='text-center text-base-content/60 py-8'>
								<LuFileText className='h-8 w-8 mx-auto mb-2 opacity-50' />
								<p>No documents found</p>
							</div>
						)}
						{filteredHistory.length > 0 &&
							filteredHistory.map((entry) => (
								<Link
									key={entry.id}
									onClick={(e) => {
										if (id === entry.id) e.preventDefault()
									}}
									className={cn('border border-current/25 rounded-box relative overflow-hidden p-3 group', {
										'cursor-default border-primary border-2': id === entry.id,
									})}
									href={`/${entry.id}`}
								>
									<div className='flex gap-1 justify-between text-2xs opacity-65'>
										<p>{format(new Date(entry.lastOpened), 'yyyy-MM-dd hh:mma')}</p>
										<p>{entry.id}</p>
									</div>
									<h3>{entry.title}</h3>
									{entry.id === '' && (
										<div className='absolute top-3 right-3'>
											<LuWifiOff />
										</div>
									)}
									{id !== entry.id && entry.id !== '' && (
										<button
											type='button'
											title='hide/remove from history'
											className='absolute top-1 right-1 btn btn-ghost btn-xs backdrop-blur invisible group-hover:visible'
											onClick={(e) => {
												e.preventDefault()
												remove(entry.id)
											}}
										>
											<LuEyeOff />
										</button>
									)}
								</Link>
							))}
					</div>
				</aside>
			</div>
		</div>
	)
}
