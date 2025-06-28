'use client'

import { useHasMounted } from '@/hooks/use-has-mounted'
import { cn, themes } from '@/utils'
import { useTheme } from 'next-themes'
import { LuPalette } from 'react-icons/lu'

export function ThemePicker() {
	const hasMounted = useHasMounted()
	const { resolvedTheme, setTheme } = useTheme()
	const theme = themes.find((x) => x.name === resolvedTheme)

	if (!hasMounted)
		return (
			<label className='btn btn-ghost btn-square'>
				<LuPalette />
			</label>
		)

	return (
		<div className='dropdown dropdown-end'>
			<label tabIndex={0} className='btn btn-ghost btn-square'>
				{theme ? <theme.icon /> : <LuPalette />}
			</label>
			<ul
				tabIndex={0}
				className='dropdown-content overflow-auto max-h-[50dvh] menu grid p-2 backdrop-blur-2xl border border-current/25 rounded-box'
			>
				{themes.map((x) => (
					<li key={x.name}>
						<button
							className={cn({ 'before:content-["⦿"]': resolvedTheme === x.name })}
							onClick={() => setTheme(resolvedTheme === x.name ? 'system' : x.name)}
						>
							{x.name}
						</button>
					</li>
				))}
			</ul>
		</div>
	)
}
