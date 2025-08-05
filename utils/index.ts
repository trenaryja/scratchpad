import { RemoveIndexSignature } from '@/globals'
import { clsx, type ClassValue } from 'clsx'
import daisyThemes from 'daisyui/theme/object'
import { IconType } from 'react-icons/lib'
import {
	LuAnchor,
	LuAudioLines,
	LuBedDouble,
	LuBot,
	LuBriefcase,
	LuBriefcaseBusiness,
	LuCableCar,
	LuCakeSlice,
	LuCircle,
	LuCloudMoon,
	LuCoffee,
	LuCupSoda,
	LuDices,
	LuDisc3,
	LuDonut,
	LuDroplet,
	LuEgg,
	LuFlaskConical,
	LuFlower2,
	LuGem,
	LuGhost,
	LuHeadphones,
	LuHeart,
	LuLeaf,
	LuLightbulb,
	LuLightbulbOff,
	LuPalette,
	LuShapes,
	LuShip,
	LuSnowflake,
	LuSprout,
	LuSunDim,
	LuSunset,
	LuTreePine,
} from 'react-icons/lu'
import * as R from 'remeda'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export type ThemeName = keyof RemoveIndexSignature<typeof daisyThemes>

export const themeIcons: Record<ThemeName, IconType> = {
	abyss: LuAnchor,
	acid: LuFlaskConical,
	aqua: LuDroplet,
	autumn: LuLeaf,
	black: LuCircle,
	bumblebee: LuFlower2,
	business: LuBriefcaseBusiness,
	caramellatte: LuCoffee,
	cmyk: LuPalette,
	coffee: LuCoffee,
	corporate: LuBriefcase,
	cupcake: LuCakeSlice,
	cyberpunk: LuBot,
	dark: LuLightbulbOff,
	dim: LuSunDim,
	dracula: LuDonut,
	emerald: LuGem,
	fantasy: LuDices,
	forest: LuTreePine,
	garden: LuSprout,
	halloween: LuGhost,
	lemonade: LuCupSoda,
	light: LuLightbulb,
	lofi: LuHeadphones,
	luxury: LuShip,
	night: LuCloudMoon,
	nord: LuCableCar,
	pastel: LuEgg,
	retro: LuDisc3,
	silk: LuBedDouble,
	sunset: LuSunset,
	synthwave: LuAudioLines,
	valentine: LuHeart,
	winter: LuSnowflake,
	wireframe: LuShapes,
}

export const themes = R.pipe(
	daisyThemes,
	R.entries(),
	R.map(([name, theme]) => ({
		name: name as ThemeName,
		mode: theme['color-scheme'] as 'dark' | 'light',
		icon: themeIcons[name as ThemeName],
	})),
	R.sortBy(R.prop('mode'), R.prop('name')),
)

export const showModal = (id: string) => (document?.getElementById(id) as HTMLDialogElement).showModal()

export const makeUniquePairs = <T extends readonly string[]>(options: T) => {
	const res: { [U in T[number]]: `${U}|${Exclude<T[number], U>}` }[T[number]][] = []
	for (const a of options) {
		for (const b of options) {
			if (a !== b) res.push(`${a}|${b}` as never)
		}
	}
	return res
}
