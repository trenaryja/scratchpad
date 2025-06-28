import { ConvexProvider } from '@/components/convex-provider'
import { Sidebar } from '@/components/sidebar'
import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import type React from 'react'

import './globals.css'

export const metadata: Metadata = {
	title: 'Markdown Scratchpad',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en' suppressHydrationWarning className='scroll-smooth'>
			<body className='sans'>
				<ThemeProvider>
					<ConvexProvider>
						<Sidebar />
						<main>{children}</main>
					</ConvexProvider>
				</ThemeProvider>
			</body>
		</html>
	)
}
