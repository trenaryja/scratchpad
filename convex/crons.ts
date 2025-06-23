import { cronJobs } from "convex/server"
import { internal } from "./_generated/api"

const crons = cronJobs()

crons.weekly(
  "delete old documents",
  { dayOfWeek: "sunday", hourUTC: 2, minuteUTC: 0 },
  internal.documents.deleteOldDocuments,
)

export default crons
