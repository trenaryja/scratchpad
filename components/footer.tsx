'use client'

import Link from 'next/link'
import { LuCloudUpload, LuInfo, LuLock, LuWifiOff, LuX } from 'react-icons/lu'

const INFO_DIALOG_ID = 'dialog-info'

const InfoDialogButton = () => (
	<button
		className='btn btn-ghost btn-square hover:btn-primary'
		onClick={() => (document?.getElementById(INFO_DIALOG_ID) as HTMLDialogElement).showModal()}
	>
		<LuInfo />
	</button>
)

const InfoDialog = () => (
	<dialog id={INFO_DIALOG_ID} className='modal'>
		<div className='modal-box [&_svg]:shrink-0 grid gap-y-4 place-items-center'>
			<form method='dialog' className='absolute right-1 top-1'>
				<button className='btn btn-ghost btn-square'>
					<LuX />
				</button>
			</form>

			<h2 className='font-bold text-xl col-span-full'>How This App Works</h2>

			<div className='flex items-center justify-center gap-2 font-bold'>
				<LuWifiOff className='inline-block' />
				<h3>Offline by default</h3>
			</div>
			<p className='indent-4'>
				When working at the homepage of the app, you are working offline in a private scratchpad. The content of this
				scratchpad won't be uploaded or shared until you choose to publish.
			</p>

			<div className='flex items-center justify-center gap-2 font-bold'>
				<LuCloudUpload className='inline-block' />
				<h3>Publish & Share</h3>
			</div>
			<p className='indent-4'>
				Double-clicking the publish button will generate a unique link with a random 8-character ID, where anyone with
				the link can view/edit the scratchpad in real time.
			</p>

			<div className='flex items-center justify-center gap-2 font-bold'>
				<LuLock className='inline-block' />
				<h3>No logins, no passwords</h3>
			</div>
			<p className='indent-4'>
				There's no authentication by design. Published scratchpads are accessible by anyone with the link, so it is
				strongly encouraged to not publish any sensitive content. However, with the randomly generated id used for every
				published scratchpad, there are over 281 trillion possible links. The odds of someone stumbling onto yours is
				astronomically small.{' '}
				<Link href='https://zelark.github.io/nano-id-cc/' target='_blank' rel='noopener noreferrer' className='link'>
					See the math here.
				</Link>
			</p>
		</div>
	</dialog>
)

export const Footer = () => {
	return (
		<footer className='flex items-center justify-center p-1 gap-2 bg-base-200 text-sm'>
			<span>Made with</span>
			<span className='text-shadow-[0_0_0] text-shadow-base-content text-transparent'>❤️</span>
			<span>by Justin Trenary</span>
			<InfoDialogButton />
			<InfoDialog />
		</footer>
	)
}
