import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  items: defineTable({
    title: v.string(),
    lore: v.string(),
    image: v.string(),
  }),

  users: defineTable({
    name: v.string(),
    balance: v.number(),
    inventory: v.array(v.id("items")),
    auctions: v.array(v.id("auctions")),
  }),
  auctions: defineTable({
    title: v.string(),
    lore: v.string(),
    image: v.string(),
    currentBid: v.optional(v.number()),
    buyNowPrice: v.optional(v.number()),
    end: v.number(),
    bidcount: v.number(),
    seller: v.id("users"),
    category: v.string(), // fixed typo and made it a string for indexing
    bids: v.record(
      v.string(),
      v.object({ id: v.id("users"), bid: v.number() }),
    ),
    created: v.number(), // timestamp for "new" sorting
  })
    .index("by_price", ["currentBid"])
    .index("by_end", ["end"])
    .index("by_bidcount", ["bidcount"])
    .index("by_category", ["category"])
    .index("by_buyNowPrice", ["buyNowPrice"])
    .index("by_created", ["created"]),
});
