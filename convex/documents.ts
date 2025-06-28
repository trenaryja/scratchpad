import { v } from 'convex/values'
import type { DataModel } from './_generated/dataModel'
import { internalMutation, mutation, query } from './_generated/server'

export const getDocument = query({
	args: { nanoid: v.string() },
	handler: async (ctx, { nanoid }) =>
		ctx.db
			.query('documents')
			.withIndex('by_nanoid', (q) => q.eq('nanoid', nanoid))
			.first(),
})

export const createDocument = mutation({
	args: {
		nanoid: v.string(),
		title: v.string(),
		content: v.string(),
	},
	handler: async (ctx, { nanoid, title, content }) => {
		const now = Date.now()
		const existing = await ctx.db
			.query('documents')
			.withIndex('by_nanoid', (q) => q.eq('nanoid', nanoid))
			.first()

		return existing
			? ctx.db.patch(existing._id, { title, content, modifiedAt: now })
			: ctx.db.insert('documents', {
					nanoid,
					title,
					content,
					createdAt: now,
					modifiedAt: now,
				})
	},
})

export const updateDocument = mutation({
	args: {
		nanoid: v.string(),
		title: v.optional(v.string()),
		content: v.optional(v.string()),
	},
	handler: async (ctx, { nanoid, title, content }) => {
		const doc = await ctx.db
			.query('documents')
			.withIndex('by_nanoid', (q) => q.eq('nanoid', nanoid))
			.first()
		if (!doc) throw new Error('Document not found')

		const updates: Partial<DataModel['documents']['document']> = {
			modifiedAt: Date.now(),
			...(title !== undefined && { title }),
			...(content !== undefined && { content }),
		}

		return ctx.db.patch(doc._id, updates)
	},
})

export const deleteDocument = mutation({
	args: { nanoid: v.string() },
	handler: async (ctx, { nanoid }) => {
		const doc = await ctx.db
			.query('documents')
			.withIndex('by_nanoid', (q) => q.eq('nanoid', nanoid))
			.first()
		if (!doc) throw new Error('Document not found')
		await ctx.db.delete(doc._id)
	},
})

export const deleteOldDocuments = internalMutation({
	args: {},
	handler: async (ctx) => {
		const now = Date.now()
		const week = 7 * 24 * 60 * 60 * 1000
		const month = 30 * 24 * 60 * 60 * 1000

		const docs = await ctx.db
			.query('documents')
			.withIndex('by_modifiedAt')
			.filter((q) => q.and(q.lt(q.field('modifiedAt'), now - week), q.gt(q.field('createdAt'), now - month)))
			.collect()

		await Promise.all(docs.map((doc) => ctx.db.delete(doc._id)))
		return { deleted: docs.length }
	},
})
