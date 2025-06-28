import { ScratchPad } from '@/components/scratch-pad'

export default async function DocumentPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	const isValidId = /^[0-9A-Za-z_-]{8}$/.test(id)

	if (!isValidId) {
		return (
			<div className='flex items-center justify-center h-full'>
				<div className='text-center'>
					<h1 className='text-2xl font-bold mb-2'>Invalid Document ID</h1>
					<p className='text-base-content/60'>The document ID must be 8 characters long.</p>
				</div>
			</div>
		)
	}

	return <ScratchPad id={id} />
}
