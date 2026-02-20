'use client'

import { ErrorFallback } from '@/components/error-fallback'

export default function ErrorPage(props: { error: Error; reset: () => void }) {
	return <ErrorFallback {...props} />
}
