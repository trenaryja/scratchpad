'use client'

import { ThemeToggle } from '@/components/theme-toggle'
import { LuMenu } from 'react-icons/lu'

interface HeaderProps {
	onToggleSidebar: () => void
}

export function Header({ onToggleSidebar }: HeaderProps) {
	return (
		<header className='navbar bg-base-100 border-b border-base-300 px-4'>
			<div className='navbar-start'>
				<button className='btn btn-ghost btn-sm btn-square lg:hidden' onClick={onToggleSidebar}>
					<LuMenu className='h-5 w-5' />
				</button>
			</div>
			<div className='navbar-end'>
				<ThemeToggle />
			</div>
		</header>
	)
}
