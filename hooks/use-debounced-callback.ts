import { useCallback, useEffect, useRef } from 'react'

export function useDebouncedCallback<T extends (...args: never[]) => void>(callback: T, delay: number) {
	const timeoutRef = useRef<NodeJS.Timeout | null>(null)

	const debounced = useCallback(
		(...args: Parameters<T>) => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current)
			timeoutRef.current = setTimeout(() => {
				callback(...args)
			}, delay)
		},
		[callback, delay],
	)

	useEffect(() => () => clearTimeout(timeoutRef.current!), [])

	return debounced
}
