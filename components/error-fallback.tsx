'use client'

export function ErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
	return (
		<>
			<div />
			<div className='full-bleed-container place-items-center debug'>
				<div className='grid gap-4'>
					<h2 className='text-2xl font-bold'>Something went wrong</h2>
					<p className='text-base-content/70'>{error.message || 'Failed to load document'}</p>
					<button type='button' className='btn btn-primary w-fit' onClick={reset}>
						Try Again
					</button>
				</div>
			</div>
		</>
	)
}
