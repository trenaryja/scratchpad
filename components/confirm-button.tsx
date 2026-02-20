import { cn } from '@trenaryja/ui'
import type { ComponentProps, ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'

export type ConfirmButtonProps = Omit<ComponentProps<'button'>, 'onClick'> & {
	onConfirm: () => void
	confirmChildren?: ReactNode
	confirmClassName?: string
	timeout?: number
}

export const ConfirmButton = ({
	children,
	confirmChildren = 'Are you sure?',
	confirmClassName,
	onConfirm,
	className,
	timeout = 3000,
	...props
}: ConfirmButtonProps) => {
	const [isAwaitingConfirmation, setIsAwaitingConfirmation] = useState(false)
	const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null)

	useEffect(
		() => () => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current)
		},
		[],
	)

	const handleClick = () => {
		if (!isAwaitingConfirmation) {
			setIsAwaitingConfirmation(true)
			timeoutRef.current = setTimeout(() => setIsAwaitingConfirmation(false), timeout)
		} else {
			if (timeoutRef.current) clearTimeout(timeoutRef.current)
			onConfirm()
			setIsAwaitingConfirmation(false)
		}
	}

	return (
		<button
			type='button'
			className={cn(isAwaitingConfirmation ? confirmClassName : className)}
			onClick={handleClick}
			{...props}
		>
			{isAwaitingConfirmation ? confirmChildren : children}
		</button>
	)
}
