import { ConvexProvider } from '@/components/convex-provider'
import { Footer } from '@/components/footer'
import { Sidebar } from '@/components/sidebar'
import { ThemeProvider, Toaster } from '@trenaryja/ui'
import type React from 'react'
import './globals.css'

export type PageProps = { params: Promise<{ id: string }> }

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en' suppressHydrationWarning className='scroll-smooth sans'>
			<body className='grid grid-rows-[auto_1fr_auto] max-h-screen min-h-screen'>
				<ThemeProvider>
					<ConvexProvider>
						<Sidebar />
						{children}
						<Footer />
						<Toaster />
					</ConvexProvider>
				</ThemeProvider>
			</body>
		</html>
	)
}
