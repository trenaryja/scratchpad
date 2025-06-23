import { ConvexProvider } from '@/components/convex-provider'
import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import type React from 'react'
import './globals.css'

export const metadata: Metadata = {
	title: 'Markdown Scratchpad',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en' suppressHydrationWarning className='scroll-smooth'>
			<body className='sans grid min-h-dvh'>
				<ThemeProvider>
					<ConvexProvider>{children}</ConvexProvider>
				</ThemeProvider>
			</body>
		</html>
	)
}
