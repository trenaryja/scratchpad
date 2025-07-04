'use client'

import { cn } from '@/utils'
import React, { ComponentProps, useEffect, useRef, useState } from 'react'

export type SwapCycleProps = ComponentProps<'div'> & {
	duration?: number | number[]
	animationDuration?: number
}

export const SwapCycle = ({ children, className, duration = 2000, animationDuration = 200 }: SwapCycleProps) => {
	const childArray = React.Children.toArray(children)
	const [showOn, setShowOn] = useState(false)
	const [offIndex, setOffIndex] = useState(0)
	const [onIndex, setOnIndex] = useState(childArray.length > 1 ? 1 : 0)
	const [durationIndex, setDurationIndex] = useState(0)
	const checkboxRef = useRef<HTMLInputElement>(null)
	const timeoutRef = useRef<NodeJS.Timeout | null>(null)

	useEffect(() => {
		if (timeoutRef.current) clearTimeout(timeoutRef.current)

		timeoutRef.current = setTimeout(
			() => {
				setShowOn((prev) => !prev)
				setTimeout(() => {
					const fn = showOn ? setOnIndex : setOffIndex
					fn((prev) => (prev + 2) % childArray.length)
					setDurationIndex((prev) => prev + 1)
				}, animationDuration)
			},
			Array.isArray(duration) ? duration[durationIndex % duration.length] : duration,
		)

		return () => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current)
		}
	}, [showOn, durationIndex, animationDuration, childArray.length])

	useEffect(() => {
		if (checkboxRef.current) checkboxRef.current.checked = showOn
	}, [showOn])

	return (
		<div className={cn('swap', className)}>
			<input type='checkbox' ref={checkboxRef} />
			<div className='swap-on'>{childArray[onIndex]}</div>
			<div className='swap-off'>{childArray[offIndex]}</div>
		</div>
	)
}
