'use client'

import type { ComponentProps } from 'react'
import React, { useEffect, useRef } from 'react'

type HoldableButtonProps = ComponentProps<'button'> & {
	onHold?: (event: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => void
	holdDuration?: number
}

export const HoldableButton = ({ onClick, onHold, holdDuration = 1000, ...props }: HoldableButtonProps) => {
	const timerRef = useRef<NodeJS.Timeout | null>(null)

	useEffect(
		() => () => {
			if (timerRef.current) clearTimeout(timerRef.current)
		},
		[],
	)
	const isHeldRef = useRef(false)
	const isPressedRef = useRef(false)
	const hadTouchRef = useRef(false)

	const handlePressStart = (event: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
		if (event.type === 'touchstart') hadTouchRef.current = true
		isHeldRef.current = false
		isPressedRef.current = true

		if (onHold) {
			timerRef.current = setTimeout(() => {
				isHeldRef.current = true
				onHold(event)
			}, holdDuration)
		}
	}

	const handlePressEnd = (event: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
		if (timerRef.current) clearTimeout(timerRef.current)
		if (event.type === 'mouseup' && hadTouchRef.current) {
			setTimeout(() => (hadTouchRef.current = false), 0)
			isPressedRef.current = false
			return
		}
		if (!isHeldRef.current && isPressedRef.current && onClick) onClick(event as React.MouseEvent<HTMLButtonElement>)
		isPressedRef.current = false
	}

	const handlePressCancel = () => {
		if (timerRef.current) clearTimeout(timerRef.current)
		isPressedRef.current = false
	}

	return (
		<button
			type='button'
			{...props}
			onMouseDown={handlePressStart}
			onMouseUp={handlePressEnd}
			onMouseLeave={handlePressCancel}
			onTouchStart={handlePressStart}
			onTouchEnd={handlePressEnd}
			onTouchCancel={handlePressCancel}
		>
			{props.children}
		</button>
	)
}
