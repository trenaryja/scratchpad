import type { PageProps } from '@/app/layout'
import { InvalidId } from '@/components/invalid-id'
import { ScratchPad } from '@/components/scratch-pad'

export default async function PublishedPage({ params }: PageProps) {
	const { id } = await params
	const isValidId = /^[\w-]{8}$/.test(id)
	if (!isValidId) return <InvalidId />

	return <ScratchPad id={id} readonly />
}
