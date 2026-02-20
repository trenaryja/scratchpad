'use client'

import { cn, useCycle } from '@trenaryja/ui'
import type { ComponentProps, ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'

export type SwapCycleProps = ComponentProps<'div'> & {
	items: readonly ReactNode[]
	duration?: number | readonly number[]
}

export const SwapCycle = ({ items, className, duration = 2000, ...props }: SwapCycleProps) => {
	const { index, value, next, increment } = useCycle(items)
	const [flipped, setFlipped] = useState(false)
	const checkboxRef = useRef<HTMLInputElement>(null)

	const incrementRef = useRef(increment)
	useEffect(() => {
		incrementRef.current = increment
	})

	useEffect(() => {
		const d = Array.isArray(duration) ? duration[index % duration.length] : duration
		const timer = setTimeout(() => {
			incrementRef.current()
			setFlipped((f) => !f)
		}, d)
		return () => clearTimeout(timer)
	}, [index, duration])

	useEffect(() => {
		if (checkboxRef.current) checkboxRef.current.checked = flipped
	}, [flipped])

	return (
		<div className={cn('swap', className)} {...props}>
			<input type='checkbox' ref={checkboxRef} />
			<div className='swap-on'>{flipped ? value : next}</div>
			<div className='swap-off'>{flipped ? next : value}</div>
		</div>
	)
}
