import { ConvexProvider } from '@/components/convex-provider'
import { Footer } from '@/components/footer'
import { Sidebar } from '@/components/sidebar'
import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import type React from 'react'

import { cn } from '@/utils'
import './globals.css'

export const metadata: Metadata = {
	title: 'Markdown Scratchpad',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en' suppressHydrationWarning className='scroll-smooth sans'>
			<body
				className={cn(
					'grid grid-rows-[auto_1fr_auto] max-h-screen min-h-screen',
					'[&_.btn]:btn-sm lg:[&_.btn]:btn-md',
					'[&_.input]:input-sm lg:[&_.input]:input-md',
				)}
			>
				<ThemeProvider>
					<ConvexProvider>
						<Sidebar />
						{children}
						<Footer />
					</ConvexProvider>
				</ThemeProvider>
			</body>
		</html>
	)
}
