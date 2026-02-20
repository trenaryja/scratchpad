import { makeUniquePairs } from '@/utils'
import { cn, Modal } from '@trenaryja/ui'
import { LuCode, LuColumns2, LuLetterText } from 'react-icons/lu'

export const viewOptions = ['code', 'readonly'] as const
export const multiViewOptions = makeUniquePairs(viewOptions)

export type SingleViewOption = (typeof viewOptions)[number]

type MultiViewOption = (typeof multiViewOptions)[number]

export type ViewOption = MultiViewOption | SingleViewOption

const viewIcons: Record<SingleViewOption, React.ReactNode> = {
	code: <LuCode />,
	readonly: <LuLetterText />,
}

export const ViewDialog = ({ view, setView }: { view: ViewOption; setView: (v: ViewOption) => void }) => (
	<Modal
		trigger={
			<button type='button' title='Change view' className='btn btn-square hover:btn-primary'>
				<LuColumns2 />
			</button>
		}
	>
		<h2 className='text-lg text-center'>Single View</h2>
		<div className='flex gap-2 justify-center'>
			{viewOptions.map((viewOption) => (
				<button
					type='button'
					key={viewOption}
					title={viewOption}
					className={cn('btn btn-xl btn-square', { 'btn-primary': view === viewOption })}
					onClick={() => setView(viewOption)}
				>
					{viewIcons[viewOption]}
				</button>
			))}
		</div>

		<div className='divider'>OR</div>

		<h2 className='text-lg text-center'>Split View</h2>
		<div className='grid gap-2 grid-cols-2 place-items-center'>
			{multiViewOptions.map((viewOption) => {
				const [leftView, rightView] = viewOption.split('|') as [SingleViewOption, SingleViewOption]
				return (
					<button
						type='button'
						key={viewOption}
						title={viewOption}
						className={cn('btn btn-xl flex items-center px-0 w-[calc(var(--size)*2)]', {
							'btn-primary': view === viewOption,
						})}
						onClick={() => setView(viewOption)}
					>
						{viewIcons[leftView]}
						<div className='divider divider-horizontal m-1' />
						{viewIcons[rightView]}
					</button>
				)
			})}
		</div>
	</Modal>
)
