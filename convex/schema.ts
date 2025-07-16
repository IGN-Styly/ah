import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  items: defineTable({
    category: v.string(),
    title: v.string(),
    lore: v.string(),
    image: v.string(),
  })
    .index("by_title", ["title"])
    .index("by_category", ["category"]),
  users: defineTable({
    name: v.string(),
    balance: v.number(),
    inventory: v.array(v.id("items")),
    auctions: v.array(v.id("auctions")),
  }),
  bids: defineTable({
    userId: v.id("users"),
    bid: v.number(),
    auctionId: v.id("auctions"),
  })
    .index("by_userId", ["userId"])
    .index("by_auctionId", ["auctionId"]),
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
  })
    .index("by_price", ["currentBid"])
    .index("by_end", ["end"])
    .index("by_bidcount", ["bidcount"])
    .index("by_category", ["category"])
    .index("by_buyNowPrice", ["buyNowPrice"])
    .index("by_seller", ["seller"])
    .searchIndex("search_title", {
      searchField: "title",
      filterFields: ["lore"],
    }),
});
