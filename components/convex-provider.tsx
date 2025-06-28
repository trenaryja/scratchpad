'use client'

import { ConvexProvider as _ConvexProvider, ConvexReactClient } from 'convex/react'

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL)

export function ConvexProvider({ children }: { children: React.ReactNode }) {
	return <_ConvexProvider client={convex}>{children}</_ConvexProvider>
}
