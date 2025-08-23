// convex/schema.ts
import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
	documents: defineTable({
		id: v.string(),
		snapshotBase64: v.optional(v.string()),
		lastCompacted: v.optional(v.number()),
	}).index('by_nanoid', ['id']),

	updates: defineTable({
		docId: v.string(),
		updateBase64: v.string(), // Yjs update
		user: v.optional(v.string()),
		ts: v.number(),
	}).index('by_docId', ['docId']),
})
