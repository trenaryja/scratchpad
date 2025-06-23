"use client"

// Conditional Convex imports with fallbacks
let convexApi: any = null
let useQuery: any = null
let useMutation: any = null

try {
  // Try to import Convex API - will fail if not generated yet
  const convexReact = require("convex/react")
  useQuery = convexReact.useQuery
  useMutation = convexReact.useMutation

  try {
    const api = require("@/convex/_generated/api")
    convexApi = api.api
  } catch (apiError) {
    console.log("Convex API not generated yet - using fallback mode")
  }
} catch (convexError) {
  console.log("Convex not available - using fallback mode")
}

// Fallback hooks when Convex is not available
const fallbackUseQuery = () => undefined
const fallbackUseMutation = () => () => Promise.resolve()

export const safeUseQuery = useQuery || fallbackUseQuery
export const safeUseMutation = useMutation || fallbackUseMutation
export { convexApi }

export const isConvexAvailable = () => convexApi !== null
