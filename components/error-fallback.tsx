'use client'

const getUserMessage = (message: string) => {
	if (message.includes('Server Error') || !message) return 'The service is temporarily unavailable. Please try again.'
	return message
}

export function ErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
	return (
		<>
			<div />
			<div className='full-bleed-container place-items-center'>
				<div className='grid gap-4'>
					<h2 className='text-2xl font-bold'>Something went wrong</h2>
					<p className='text-base-content/70'>{getUserMessage(error.message)}</p>
					<button type='button' className='btn btn-primary w-fit' onClick={reset}>
						Try Again
					</button>
				</div>
			</div>
		</>
	)
}
