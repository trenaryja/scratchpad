'use client'

import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'
import type React from 'react'
import { useState } from 'react'

interface AppLayoutProps {
	children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
	const [sidebarOpen, setSidebarOpen] = useState(false)

	return (
		<div className='drawer lg:drawer-open'>
			<input
				id='drawer-toggle'
				type='checkbox'
				className='drawer-toggle'
				checked={sidebarOpen}
				onChange={(e) => setSidebarOpen(e.target.checked)}
			/>

			<div className='drawer-content flex flex-col'>
				<Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
				<main className='flex-1 overflow-hidden'>{children}</main>
			</div>

			<div className='drawer-side'>
				<label htmlFor='drawer-toggle' className='drawer-overlay'></label>
				<Sidebar />
			</div>
		</div>
	)
}
