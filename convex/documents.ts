import { v } from 'convex/values'
import * as Y from 'yjs'
import { mutation, query } from './_generated/server'
import { base64ToUint8Array, HARD_LIMIT, TITLE_LIMIT, uint8ArrayToBase64 } from './utils'

export const getDocument = query({
	args: { id: v.string() },
	handler: async (ctx, { id }) => {
		return await ctx.db
			.query('documents')
			.withIndex('by_nanoid', (q) => q.eq('id', id))
			.first()
	},
})

export const createDocument = mutation({
	args: {
		id: v.string(),
		title: v.optional(v.string()),
		content: v.optional(v.string()),
	},
	handler: async (ctx, { id, title, content }) => {
		if (title && title.length > TITLE_LIMIT) throw new Error(`Title too long (max ${TITLE_LIMIT} characters)`)
		if (content && content.length > HARD_LIMIT) throw new Error(`Content too long (max ${HARD_LIMIT} characters)`)

		const existing = await ctx.db
			.query('documents')
			.withIndex('by_nanoid', (q) => q.eq('id', id))
			.first()
		if (existing) return existing._id

		const ydoc = new Y.Doc()
		if (title) ydoc.getText('title').insert(0, title)
		if (content) ydoc.getText('content').insert(0, content)
		const snapshot = Y.encodeStateAsUpdate(ydoc)

		return await ctx.db.insert('documents', {
			id,
			snapshotBase64: uint8ArrayToBase64(snapshot),
		})
	},
})

export const updateSnapshot = mutation({
	args: {
		id: v.string(),
		updateBase64: v.string(),
	},
	handler: async (ctx, { id, updateBase64 }) => {
		if (updateBase64.length > 200_000) throw new Error('Update too large')

		const doc = await ctx.db
			.query('documents')
			.withIndex('by_nanoid', (q) => q.eq('id', id))
			.first()
		if (!doc) throw new Error('Document not found')

		// Merge incoming update with stored state via Yjs CRDT
		const ydoc = new Y.Doc()
		if (doc.snapshotBase64) Y.applyUpdate(ydoc, base64ToUint8Array(doc.snapshotBase64))
		Y.applyUpdate(ydoc, base64ToUint8Array(updateBase64))

		const contentText = ydoc.getText('content').toString()
		if (contentText.length > HARD_LIMIT) throw new Error(`Content too long (max ${HARD_LIMIT} characters)`)
		const titleText = ydoc.getText('title').toString()
		if (titleText.length > TITLE_LIMIT) throw new Error(`Title too long (max ${TITLE_LIMIT} characters)`)

		const merged = Y.encodeStateAsUpdate(ydoc)

		await ctx.db.patch(doc._id, {
			snapshotBase64: uint8ArrayToBase64(merged),
		})
	},
})

export const deleteDocument = mutation({
	args: { id: v.string() },
	handler: async (ctx, { id }) => {
		const doc = await ctx.db
			.query('documents')
			.withIndex('by_nanoid', (q) => q.eq('id', id))
			.first()
		if (!doc) throw new Error('Document not found')
		await ctx.db.delete(doc._id)
	},
})
