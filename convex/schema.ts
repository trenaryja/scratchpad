import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
	documents: defineTable({
		id: v.string(),
		snapshotBase64: v.optional(v.string()),
	}).index('by_nanoid', ['id']),
})
