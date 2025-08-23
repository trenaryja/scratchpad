'use client'

import { ConvexProvider as _ConvexProvider, ConvexReactClient } from 'convex/react'

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL)

export const ConvexProvider = ({ children }: { children: React.ReactNode }) => (
	<_ConvexProvider client={convex}>{children}</_ConvexProvider>
)
