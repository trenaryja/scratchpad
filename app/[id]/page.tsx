import { PageProps } from '@/app/layout'
import { InvalidId } from '@/components/invalid-id'
import { ScratchPad } from '@/components/scratch-pad'

export default async function ReadOnlyPage({ params }: PageProps) {
	const { id } = await params
	const isValidId = /^[0-9A-Za-z_-]{8}$/.test(id)
	if (!isValidId) return <InvalidId />

	return <ScratchPad id={id} />
}
