import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values"

export default defineSchema({
    users: defineTable({
        username: v.string(),
        externalId: v.string()
    })
        .index("byExternalId", ["externalId"])
        .index("byUserName", ["username"])
});