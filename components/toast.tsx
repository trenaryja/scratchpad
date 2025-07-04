'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner, ToasterProps } from 'sonner'

export const Toaster = ({ ...props }: ToasterProps) => {
	const { theme = 'system' } = useTheme()

	return (
		<Sonner
			theme={theme as ToasterProps['theme']}
			className='toaster group'
			toastOptions={{
				closeButton: true,
				className: 'backdrop-blur! bg-base-100/25! border! border-current/25!',
				classNames: {
					icon: 'size-auto!',
					closeButton:
						'left-auto! -right-3.5! text-current! border-current/25! bg-base-100! hover:bg-base-content/50! hover:text-base-100!',
				},
			}}
			{...props}
		/>
	)
}
