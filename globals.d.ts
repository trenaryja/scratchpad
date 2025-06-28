declare global {
	namespace NodeJS {
		interface ProcessEnv {
			CONVEX_DEPLOYMENT: string
			NEXT_PUBLIC_CONVEX_URL: string
		}
	}
}

export type RemoveIndexSignature<T> = {
	[K in keyof T as string extends K ? never : K]: T[K]
}
