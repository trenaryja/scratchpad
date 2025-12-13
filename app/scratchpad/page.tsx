import Tiptap from '@/components/tiptap'

export default async function DemoPage() {
	return (
		<>
			<header />
			<h1 className=''>HEADS UP THIS IS JUST A SCRATCHPAD. REFRESH AND IT'S GONE</h1>

			<div className='px-[25vw] py-[25vh]'>
				<div className='rounded-xl border bg-red-500/15'>
					<Tiptap />
				</div>
			</div>
		</>
	)
}
