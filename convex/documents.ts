import { v } from 'convex/values'
import * as Y from 'yjs'
import { internalMutation, mutation, query } from './_generated/server'
import { base64ToUint8Array, uint8ArrayToBase64 } from './utils'

export const getDocument = query({
	args: { id: v.string() },
	handler: async (ctx, { id }) => {
		const doc = await ctx.db
			.query('documents')
			.withIndex('by_nanoid', (q) => q.eq('id', id))
			.first()

		if (!doc) return null

		const updates = await ctx.db
			.query('updates')
			.withIndex('by_docId', (q) => q.eq('docId', id))
			.order('asc')
			.collect()

		return { ...doc, updates }
	},
})

export const createDocument = mutation({
	args: {
		id: v.string(),
		title: v.optional(v.string()),
		content: v.optional(v.string()),
	},
	handler: async (ctx, { id, title, content }) => {
		const existing = await ctx.db
			.query('documents')
			.withIndex('by_nanoid', (q) => q.eq('id', id))
			.first()
		if (existing) return existing.id

		const ydoc = new Y.Doc()
		if (title) ydoc.getText('title').insert(0, title)
		if (content) ydoc.getText('content').insert(0, content)
		const snapshot = Y.encodeStateAsUpdate(ydoc)

		return await ctx.db.insert('documents', {
			id,
			snapshotBase64: uint8ArrayToBase64(snapshot),
			lastCompacted: Date.now(),
		})
	},
})

export const addDocUpdate = mutation({
	args: {
		id: v.string(),
		updateBase64: v.string(),
		user: v.optional(v.string()),
	},
	handler: async (ctx, { id, updateBase64, user }) => {
		await ctx.db.insert('updates', {
			docId: id,
			updateBase64,
			user,
			ts: Date.now(),
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

		const updates = await ctx.db
			.query('updates')
			.withIndex('by_docId', (q) => q.eq('docId', id))
			.collect()

		for (const u of updates) await ctx.db.delete(u._id)
	},
})

export const compactDocs = internalMutation({
	args: {},
	handler: async ({ db }) => {
		const THRESHOLD = 100

		const docs = await db.query('documents').collect()

		for (const doc of docs) {
			const updates = await db
				.query('updates')
				.withIndex('by_docId', (q) => q.eq('docId', doc.id))
				.order('asc')
				.collect()

			if (updates.length <= THRESHOLD) continue

			const ydoc = new Y.Doc()
			if (doc.snapshotBase64) Y.applyUpdate(ydoc, base64ToUint8Array(doc.snapshotBase64))
			const toCompact = updates.slice(0, -THRESHOLD)
			for (const u of toCompact) Y.applyUpdate(ydoc, base64ToUint8Array(u.updateBase64))
			const snapshot = Y.encodeStateAsUpdate(ydoc)
			await db.patch(doc._id, {
				snapshotBase64: uint8ArrayToBase64(snapshot),
				lastCompacted: Date.now(),
			})

			const chunkSize = 500
			for (let i = 0; i < toCompact.length; i += chunkSize) {
				const chunk = toCompact.slice(i, i + chunkSize)
				await Promise.all(chunk.map((u) => db.delete(u._id)))
			}
		}
	},
})
