'use client'

import * as React from 'react'

const dispatchStorageEvent = (key: string, newValue?: string | null) =>
	window.dispatchEvent(new StorageEvent('storage', { key, newValue }))

export const setLocalStorageItem = <T>(key: string, value: T) => {
	const stringifiedValue = JSON.stringify(value)
	window.localStorage.setItem(key, stringifiedValue)
	dispatchStorageEvent(key, stringifiedValue)
}

export const removeLocalStorageItem = (key: string) => {
	window.localStorage.removeItem(key)
	dispatchStorageEvent(key, null)
}

export const getLocalStorageItem = (key: string) => window.localStorage.getItem(key)

const useLocalStorageSubscribe = (callback: (event: StorageEvent) => void) => {
	window.addEventListener('storage', callback)
	return () => window.removeEventListener('storage', callback)
}

export const useLocalStorage = <T>(key: string, initialValue: T) => {
	const store = React.useSyncExternalStore(
		useLocalStorageSubscribe,
		() => getLocalStorageItem(key),
		() => null,
	)

	const setState = React.useCallback(
		(v: T | ((prev: T) => T)) => {
			try {
				const prev = store ? (JSON.parse(store) as T) : initialValue
				const nextState = typeof v === 'function' ? (v as (prev: T) => T)(prev) : v
				if (nextState === undefined || nextState === null) removeLocalStorageItem(key)
				else setLocalStorageItem(key, nextState)
			} catch (e) {
				console.warn(e)
			}
		},
		[initialValue, key, store],
	)

	React.useEffect(() => {
		if (getLocalStorageItem(key) === null && typeof initialValue !== 'undefined') setLocalStorageItem(key, initialValue)
	}, [initialValue, key])

	return [store ? (JSON.parse(store) as T) : initialValue, setState] as const
}
