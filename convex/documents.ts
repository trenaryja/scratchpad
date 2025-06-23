import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const getDocument = query({
  args: { nanoid: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("documents")
      .withIndex("by_nanoid", (q) => q.eq("nanoid", args.nanoid))
      .first()
  },
})

export const createDocument = mutation({
  args: {
    nanoid: v.string(),
    title: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now()

    // Check if document already exists
    const existing = await ctx.db
      .query("documents")
      .withIndex("by_nanoid", (q) => q.eq("nanoid", args.nanoid))
      .first()

    if (existing) {
      // Update existing document
      return await ctx.db.patch(existing._id, {
        title: args.title,
        content: args.content,
        modifiedAt: now,
      })
    }

    // Create new document
    return await ctx.db.insert("documents", {
      nanoid: args.nanoid,
      title: args.title,
      content: args.content,
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
  handler: async (ctx, args) => {
    const document = await ctx.db
      .query("documents")
      .withIndex("by_nanoid", (q) => q.eq("nanoid", args.nanoid))
      .first()

    if (!document) {
      throw new Error("Document not found")
    }

    const updates: any = {
      modifiedAt: Date.now(),
    }

    if (args.title !== undefined) {
      updates.title = args.title
    }

    if (args.content !== undefined) {
      updates.content = args.content
    }

    return await ctx.db.patch(document._id, updates)
  },
})

export const listRecentDocuments = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("documents").withIndex("by_modified").order("desc").take(50)
  },
})

export const deleteOldDocuments = mutation({
  args: {},
  handler: async (ctx) => {
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
    const oneMonthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000

    // Delete documents that haven't been modified in a week but are newer than a month
    const documentsToDelete = await ctx.db
      .query("documents")
      .withIndex("by_modified")
      .filter((q) => q.and(q.lt(q.field("modifiedAt"), oneWeekAgo), q.gt(q.field("createdAt"), oneMonthAgo)))
      .collect()

    for (const doc of documentsToDelete) {
      await ctx.db.delete(doc._id)
    }

    return { deleted: documentsToDelete.length }
  },
})
