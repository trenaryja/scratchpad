// Encode Uint8Array → base64
export const uint8ArrayToBase64 = (bytes: Uint8Array) => {
	// Convert to binary string
	let binary = ''
	const chunkSize = 0x8000 // process in chunks to avoid call stack limits
	for (let i = 0; i < bytes.length; i += chunkSize) {
		const chunk = bytes.subarray(i, i + chunkSize)
		binary += String.fromCharCode.apply(null, Array.from(chunk))
	}
	return btoa(binary)
}

// Decode base64 → Uint8Array
export const base64ToUint8Array = (base64: string) => {
	const binary = atob(base64)
	const len = binary.length
	const bytes = new Uint8Array(len)
	for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i)
	return bytes
}
