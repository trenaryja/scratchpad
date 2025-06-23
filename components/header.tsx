'use client'

import { Menu, FileText, Settings } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { isConvexAvailable } from '@/lib/convex-client'

interface HeaderProps {
	onToggleSidebar: () => void
}

export function Header({ onToggleSidebar }: HeaderProps) {
	return (
		<header className='navbar bg-base-100 border-b border-base-300 px-4'>
			<div className='navbar-start'>
				<button className='btn btn-ghost btn-sm lg:hidden' onClick={onToggleSidebar}>
					<Menu className='h-5 w-5' />
				</button>
				<div className='flex items-center gap-2'>
					<FileText className='h-6 w-6 text-primary' />
					<span className='font-bold text-lg'>Markdown Scratchpad</span>
					{!isConvexAvailable() && <div className='badge badge-warning badge-sm'>Local</div>}
				</div>
			</div>

			<div className='navbar-center'>
				<kbd className='kbd kbd-sm'>Ctrl</kbd>
				<span className='mx-1'>+</span>
				<kbd className='kbd kbd-sm'>K</kbd>
				<span className='ml-2 text-sm text-base-content/60'>Search documents</span>
			</div>

			<div className='navbar-end'>
				<ThemeToggle />
				<button className='btn btn-ghost btn-sm'>
					<Settings className='h-5 w-5' />
				</button>
			</div>
		</header>
	)
}
