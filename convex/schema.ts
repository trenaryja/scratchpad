import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
	documents: defineTable({
		nanoid: v.string(), // The 8-character nanoid
		title: v.string(),
		content: v.string(),
		createdAt: v.number(),
		modifiedAt: v.number(),
	})
		.index('by_nanoid', ['nanoid'])
		.index('by_modifiedAt', ['modifiedAt'])
		.index('by_createdAt', ['createdAt']),
})
