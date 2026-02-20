export const makeUniquePairs = <T extends readonly string[]>(options: T) => {
	const res: { [U in T[number]]: `${U}|${Exclude<T[number], U>}` }[T[number]][] = []

	for (const a of options) {
		for (const b of options) {
			if (a !== b) res.push(`${a}|${b}` as never)
		}
	}

	return res
}
