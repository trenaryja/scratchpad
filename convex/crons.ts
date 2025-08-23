// convex/crons.ts
import { cronJobs } from 'convex/server'
import { internal } from './_generated/api'

const crons = cronJobs()

crons.interval('compact-docs', { hours: 1 }, internal.documents.compactDocs)

export default crons
