'use client'

import type React from 'react'

// Conditional Convex provider
let ConvexClientProvider: any = null
let convex: any = null

try {
	const convexReact = require('convex/react')
	const { ConvexReactClient } = convexReact
	ConvexClientProvider = convexReact.ConvexProvider

	if (process.env.NEXT_PUBLIC_CONVEX_URL) {
		convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL)
	}
} catch (_) {
	console.log('Convex not available - using fallback mode')
}

export function ConvexProvider({ children }: { children: React.ReactNode }) {
	if (ConvexClientProvider && convex) {
		return <ConvexClientProvider client={convex}>{children}</ConvexClientProvider>
	}

	// Fallback when Convex not available
	return <>{children}</>
}
