import * as React from 'react'
import { cn } from '../utils'

export type ConfirmButtonProps = Omit<React.ComponentProps<'button'>, 'onClick'> & {
	onConfirm: () => void
	confirmChildren?: React.ReactNode
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
	const [isAwaitingConfirmation, setIsAwaitingConfirmation] = React.useState(false)

	const handleClick = () => {
		if (!isAwaitingConfirmation) {
			setIsAwaitingConfirmation(true)
			setTimeout(() => setIsAwaitingConfirmation(false), timeout)
			return
		} else {
			onConfirm()
			setIsAwaitingConfirmation(false)
		}
	}

	return (
		<button
			className={cn(isAwaitingConfirmation ? [confirmClassName, className] : className)}
			onClick={handleClick}
			{...props}
		>
			{isAwaitingConfirmation ? confirmChildren : children}
		</button>
	)
}
