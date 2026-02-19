import { Tiptap } from '@/components/tiptap'

export default async function ScratchpadPage() {
	return (
		<>
			<header />
			<div className='px-[5vw] py-[5vh] grid place-items-center grid-rows-[auto_1fr] gap-8'>
				<h1 className='alert alert-error'>THIS IS JUST A SCRATCHPAD. NO MEMORY. REFRESH AND IT'S GONE</h1>
				<Tiptap className='rounded-xl border bg-red-500/5 size-full' />
			</div>
		</>
	)
}
